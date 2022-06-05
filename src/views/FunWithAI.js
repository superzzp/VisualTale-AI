import React, { useState, useEffect } from 'react';
import { LocalStorage } from '../services/LocalStorage.js';
import TwoColsGrid from "../components/TwoColsGrid";
import Selector from '../components/Selector.js';
import Spinner from '../components/Spinner.js';
// import TextAnimation from "../animations/AnimatedText";
import { inputDataModel, promptPresets } from "../utils/SelectorOptions"
import "./FunWithAI.css";

function FunWithAI() {
  // Hook
  // run after the component is mounted
  useEffect(() => {
    const results = LocalStorage.loadResultsFromLocalStorage();
    if (results.length > 0) {
      setDisplayNotice(false);
      setDisplayResponses(true);
    }
    setResultsList(results);
  }, [])

  // States 
  const [inputText, setInputText] = useState("");
  const [displayNotice, setDisplayNotice] = useState(true);
  const [displayResponses, setDisplayResponses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsList, setResultsList] = useState([]);

  // Hyperparameter states
  const [selectedDataModel, setDataModel] = useState('text-davinci-002');
  const [selectedTemperature, setTemperature] = useState(0.7);
  const [selectedMaxResTokenLength, setMaxResTokenLength] = useState(256);
 
  // Helper functions
  function addResultToUI(currID, inputText, responseText) {
    setResultsList(resultsList.concat([{ id: currID, prompt: inputText, response: responseText }]));
  }

  // Helper function, clear rendered results on UI
  function clearResultsFromUI() {
    setDisplayNotice(true);
    setDisplayResponses(false);
    setResultsList([]);
  }

  // Function for submitting input text to Open AI text generation service
  function onTextFormSubmit(event) {
    setLoading(true);
    setDisplayResponses(true);
    setDisplayNotice(false);
    // Proxy server that handle api calls to OpenAI, to protect API credentials
    // Check https://github.com/superzzp/OpenAI-Text-Generation-Service for server side code repo
    const url = "https://openai-text-generation.herokuapp.com/openai";
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "prompt": inputText,
          "max_tokens": 128,
          "model": selectedDataModel
        })
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const responseText = data.text;
        const currID = resultsList.length;
        addResultToUI(currID, inputText, responseText);
        LocalStorage.saveResultToLocalStorage(currID, inputText, responseText);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
    event.preventDefault();
  }

  function clearResults() {
    LocalStorage.clearLocalStorage();
    clearResultsFromUI();
  }

  function updateDataModel(model) {
    setDataModel(model)
  }

  function updateSelectedPreset(preset) {
    setInputText(preset)
  }

  return (
    <div>
      <h1>Silver Tongue</h1>
      <div id="app-header" className={["bottom-grey-bd", "top-grey-bd"].join(" ")}>
        <div>
          <h4 id="pg-title">Playground</h4>
        </div>
        <div id="pg-preset-select-container">
            <Selector placeholderText={"Load a preset ..."} onSelectorChange={updateSelectedPreset} options={promptPresets}></Selector>
        </div>
        <div>
          <button className='regular-button'>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </div>
      <div className='pg-body'>
        <div className="pg-left">
          <form onSubmit={onTextFormSubmit}>
            <textarea className="text-area" rows="10" value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
            {/* <Selector placeholderText={"Data model (optional)"} onSelectorChange={updateDataModel} options={inputDataModel}></Selector> */}
            <button disabled={loading} className={["button", "action-button"].join(" ")}  type="submit">Submit</button>
          </form>
          {/* {displayNotice ?
          <TextAnimation></TextAnimation>
          : null} */}
          {displayResponses ?
            <div id="responses">
              <h2>Responses:</h2>
              <Spinner color="white" loading={loading} size={50}></Spinner>
              <div className="container" id="results">
                {resultsList.slice(0).reverse().map((item) => {
                  return (<TwoColsGrid key={item.id} prompt={item.prompt} response={item.response}></TwoColsGrid>)
                })}
                <button className={["button", "action-button"].join(" ")} onClick={clearResults}>Clear Results</button>
              </div>
            </div>
            : null}
        </div>

        <div className='pg-right'>
          <div className='pg-right-content'>
            <div className='parameter-panel'>
              <div className='parameter-panel-grid'>
                <div>
                  <div className={["body-small", "control-label"].join(" ")}>Engine</div>
                  <Selector onSelectorChange={updateDataModel} options={inputDataModel} default={inputDataModel[0]}></Selector>
                </div>
                <div>
                  <div className='control-label-with-indicator'>
                    <span className={["body-small", "cli-left"].join(" ")}>Temperature</span>
                    <input className={["cli-right", "text-input"].join(" ")} value={selectedTemperature} onChange={(e) => setTemperature(e.target.value)}></input>
                  </div>
                  <div className='control-slider-container'>
                    <input className='control-slider' type="range" min="0" max="1" step="0.01" value={selectedTemperature} onChange={(e) => setTemperature(e.target.value)}></input>
                  </div>
                </div>
                <div>
                  <div className='control-label-with-indicator'>
                    <span className={["body-small", "cli-left"].join(" ")}>Maximum length</span>
                    <input className={["cli-right", "text-input"].join(" ")}></input>
                  </div>
                  <div className='control-slider-container'>
                    <input className='control-slider' type="range" min="1" max="100" id="myRange"></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {displayNotice ?
        <div id="credits">
          <span>Created by Alex Zhang <cite><a href="https://github.com/superzzp/Fun-with-AI/" target="_blank">(GitHub)</a></cite>. </span>
          <span>Powered by <cite><a href="https://openai.com/" target="_blank">Open AI</a></cite>.</span>
        </div>
        : null}
    </div>
  );
}

export default FunWithAI;
