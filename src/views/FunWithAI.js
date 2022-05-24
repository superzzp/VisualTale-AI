import React, { useState, useEffect } from 'react';
import { LocalStorage } from '../services/LocalStorage.js';
import TwoColsGrid from "../components/TwoColsGrid";
import Selector from '../components/Selector.js';
import Spinner from '../components/Spinner.js';
import TextAnimation from "../animations/AnimatedText";
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
  const [selectedDataModel, setDataModel] = useState('text-curie-001');
  const [displayNotice, setDisplayNotice] = useState(true);
  const [displayResponses, setDisplayResponses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultsList, setResultsList] = useState([]);

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

  return (
    <div>
      <div id="main-content">
        <h1>Fun with AI</h1>
        <form onSubmit={onTextFormSubmit}>
          <label id="form-label"><strong>Enter prompt:</strong></label><br />
          <textarea rows="10" id="input_text"
            onChange={(e) => setInputText(e.target.value)}></textarea>
          <Selector updateDataModel={updateDataModel}></Selector>
          <input disabled={loading} id="submit-button" className="button" type="submit" value="Submit" />
        </form>
        {displayNotice ?
          <TextAnimation></TextAnimation>
          : null}
        {displayResponses ?
          <div id="responses">
            <h2>Responses:</h2>
            <Spinner color="white" loading={loading} size={50}></Spinner>
            <div className="container" id="results">
              {resultsList.slice(0).reverse().map((item) => {
                return (<TwoColsGrid key={item.id} prompt={item.prompt} response={item.response}></TwoColsGrid>)
              })}
              <button className="button" onClick={clearResults}>Clear Results</button>
            </div>
          </div>
          : null}
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
