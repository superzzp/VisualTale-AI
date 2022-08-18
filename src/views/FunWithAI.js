import React, { useState, useEffect } from 'react';
import { LocalStorage } from '../services/LocalStorage.js';
import TwoColsGrid from "../components/TwoColsGrid";
import Selector from '../components/Selector.js';
import Spinner from '../components/Spinner.js';
import {ReactComponent as AppLogo} from '../logos/appLogo.svg';
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
  const [displayWelcomePanel, setDisplayWelcomePanel] = useState(true);
  const [displaySidePanelOverlay, setDisplaySidePanelOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsList, setResultsList] = useState([]);

  // Hyperparameter states
  const [selectedDataModel, setDataModel] = useState('text-davinci-002');
  const [selectedTemperature, setTemperature] = useState(0.7);
  const [selectedMaxResTokenLength, setMaxResTokenLength] = useState(256);
  const [selectedTopP, setTopP] = useState(1);
  const [selectedFreqPenalty, setFreqPenalty] = useState(0);
  const [selectedPresPenalty, setPresPenalty] = useState(0);

  // Dynamic classNames for components
  var pgRightFlexClassNames = displaySidePanelOverlay ? ["pg-right", "pg-visible-mobile"].join(" ") : "pg-right";
  var pgWelcomeFlexClassNames = displayWelcomePanel ? ["pg-welcome", "body-small"].join(" ") : ["pg-welcome", "body-small", "pg-hide"].join(" ");

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
          "max_tokens": selectedMaxResTokenLength,
          "temperature": selectedTemperature,
          "top_p": selectedTopP,
          "frequency_penalty": selectedFreqPenalty,
          "presence_penalty": selectedPresPenalty,
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
    setDataModel(model.text);
  }

  function updateSelectedPreset(preset) {
    setInputText(preset.text);
    setTemperature(preset.param.temp);
    setMaxResTokenLength(preset.param.maxLen);
    setTopP(preset.param.topP);
    setFreqPenalty(preset.param.freq);
    setPresPenalty(preset.param.pres);
  }

  return (
    <div className="app-root">
      <div className={["app-header", "bottom-grey-bd"].join(" ")}>
        <h1>Silver Tongue</h1>
      </div>
      <div className="pg-root">
        <div className={pgWelcomeFlexClassNames}>
          <button className={"pg-right-panel-close"} onClick={() => setDisplayWelcomePanel(false)}>×</button>
          <h3>To begin</h3>
          <p>
            Enter an instruction or select a preset, and watch the app respond with a completion that attempts to match the context or pattern you provided.
          </p>
          <p>
          You can control which model completes your request by changing the model.
          </p>
          <AppLogo/>
          <p>
            Created by Alex Zhang <cite><a href="https://github.com/superzzp/Fun-with-AI/" target="_blank">(GitHub)</a></cite>. 
            Powered by OpenAI's GPT-3 models.
          </p>
        </div>
        <div className="pg-main">
          <div id="pg-header" className={["bottom-grey-bd"].join(" ")}>
            <div>
              <h4 id="pg-title">Playground</h4>
            </div>
            <div id="pg-preset-select-container">
              <Selector placeholderText={"Load a preset ..."} onSelectorChange={updateSelectedPreset} options={promptPresets} width={250}></Selector>
            </div>
            <div>
              <button className={["regular-button", "pg-advanced-toggle"].join(" ")} onClick={() => setDisplaySidePanelOverlay(true)}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          </div>

          <div className='pg-body'>
            <div className="pg-left">
              <form onSubmit={onTextFormSubmit}>
                <textarea className="text-area" rows="10" value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
                <button disabled={loading} className={["button", "action-button"].join(" ")} type="submit">Submit</button>
              </form>
              {/* {displayNotice ?
            <TextAnimation></TextAnimation>
            : null} */}
              {displayResponses ?
                <div id="responses">
                  <h4>Responses:</h4>
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

            <div className={pgRightFlexClassNames}>
              <div className='pg-right-panel-mask'></div>
              <div className='pg-right-content'>
                <div className='parameter-panel'>
                  <button className={"pg-right-panel-close"} onClick={() => setDisplaySidePanelOverlay(false)}>×</button>
                  <div className='parameter-panel-grid'>
                    {/* Engine */}
                    <div>
                      <div className={["body-small", "control-label"].join(" ")}>Engine</div>
                      <Selector onSelectorChange={updateDataModel} options={inputDataModel} width={216} default={inputDataModel[0]}></Selector>
                    </div>
                    {/* Temperature */}
                    <div>
                      <div className='control-label-with-indicator'>
                        <span className={["body-small", "cli-left"].join(" ")}>Temperature</span>
                        <input className={["cli-right", "text-input"].join(" ")} value={selectedTemperature} onChange={(e) => { var val = Number(e.target.value); if (val >= 0 && val <= 1) { setTemperature(val) } }}></input>
                      </div>
                      <div className='control-slider-container'>
                        <input className='control-slider' type="range" min="0" max="1" step="0.01" value={selectedTemperature} onChange={(e) => setTemperature(Number(e.target.value))}></input>
                      </div>
                    </div>
                    {/* Max length */}
                    <div>
                      <div className='control-label-with-indicator'>
                        <span className={["body-small", "cli-left"].join(" ")} >Maximum length</span>
                        <input className={["cli-right", "text-input"].join(" ")} value={selectedMaxResTokenLength} onChange={(e) => { var val = Number(e.target.value); if (val >= 1 && val <= 512) { setMaxResTokenLength(val) } }}></input>
                      </div>
                      <div className='control-slider-container'>
                        <input className='control-slider' type="range" min="1" max="512" step="1" value={selectedMaxResTokenLength} onChange={(e) => setMaxResTokenLength(Number(e.target.value))}></input>
                      </div>
                    </div>
                    {/* Top p */}
                    <div>
                      <div className='control-label-with-indicator'>
                        <span className={["body-small", "cli-left"].join(" ")} >Top P</span>
                        <input className={["cli-right", "text-input"].join(" ")} value={selectedTopP} onChange={(e) => { var val = Number(e.target.value); if (val >= 0 && val <= 1) { setTopP(val) } }}></input>
                      </div>
                      <div className='control-slider-container'>
                        <input className='control-slider' type="range" min="0" max="1" step="0.01" value={selectedTopP} onChange={(e) => setTopP(Number(e.target.value))}></input>
                      </div>
                    </div>
                    {/* Frequency penalty */}
                    <div>
                      <div className='control-label-with-indicator'>
                        <span className={["body-small", "cli-left"].join(" ")} >Frequency penalty</span>
                        <input className={["cli-right", "text-input"].join(" ")} value={selectedFreqPenalty} onChange={(e) => { var val = Number(e.target.value); if (val >= 0 && val <= 2) { setFreqPenalty(val) } }}></input>
                      </div>
                      <div className='control-slider-container'>
                        <input className='control-slider' type="range" min="0" max="2" step="0.01" value={selectedFreqPenalty} onChange={(e) => setFreqPenalty(Number(e.target.value))}></input>
                      </div>
                    </div>
                    {/* Presence penalty */}
                    <div>
                      <div className='control-label-with-indicator'>
                        <span className={["body-small", "cli-left"].join(" ")} >Presence penalty</span>
                        <input className={["cli-right", "text-input"].join(" ")} value={selectedPresPenalty} onChange={(e) => { var val = Number(e.target.value); if (val >= 0 && val <= 2) { setPresPenalty(val) } }}></input>
                      </div>
                      <div className='control-slider-container'>
                        <input className='control-slider' type="range" min="0" max="2" step="0.01" value={selectedPresPenalty} onChange={(e) => setPresPenalty(Number(e.target.value))}></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {displayNotice ?
          <div id="credits">
            <span>Created by Alex Zhang <cite><a href="https://github.com/superzzp/Fun-with-AI/" target="_blank">(GitHub)</a></cite>. </span>
            <span>Powered by Open AI.</span>
          </div>
          : null} */}
      </div>
    </div>
  );
}

export default FunWithAI;
