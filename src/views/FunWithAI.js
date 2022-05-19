import "./FunWithAI.css";
import Select from 'react-select';
import TwoColsGrid from "../components/TwoColsGrid";
import TextAnimation from "../animations/AnimatedText";
import { LocalStorage } from '../services/LocalStorage.js';
import React, { useState, useEffect } from 'react';


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
  const [btnActive, setBtnActive] = useState(true);
  const [displayNotice, setDisplayNotice] = useState(true);
  const [displayResponses, setDisplayResponses] = useState(false);
  const [resultsList, setResultsList] = useState([]);

  // Data & presets
  const dataModelOptions = [
    { value: 'text-curie-001', label: 'Curie (Default)' },
    { value: 'text-davinci-002', label: 'Davinci' },
    { value: 'text-babbage-001', label: 'Babbage' },
    { value: 'text-ada-001', label: 'Ada' },
  ]
  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 10,
      backgroundColor: 'DodgerBlue',
      color: 'white',
      borderRadius: "0px",
    }),
    control: (provided) => ({
      ...provided,
      width: 230,
      backgroundColor: 'DodgerBlue',
      color: 'white',
      padding: '3px 0px',
      border: "none",
      boxShadow: "none",
      borderRadius: "0px"
    }),
    placeholder: (defaultStyles) => ({
      ...defaultStyles,
      color: 'white',
    }),
    singleValue: (defaultStyles) => ({
      ...defaultStyles,
      color: 'white',
    }),
  }
  // Helper functions
  function addResultToUI(currID, inputText, responseText) {
    setDisplayResponses(true);
    setDisplayNotice(false);
    console.log('resultText AAA:', responseText);
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
    setBtnActive(false);
    const url = "https://api.openai.com/v1/engines/" + selectedDataModel + "/completions";
    
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.REACT_APP_CREDENTIALS
      },
      body: JSON.stringify(
        {
          "prompt": inputText,
          "max_tokens": 128
        })
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const responseText = data.choices[0].text;
        const currID = resultsList.length;
        addResultToUI(currID, inputText, responseText);
        LocalStorage.saveResultToLocalStorage(currID, inputText, responseText);
        setBtnActive(true);
      })
      .catch(function (error) {
        console.log(error);
        setBtnActive(true);
      });
    event.preventDefault();
  }

  function clearResults() {
    LocalStorage.clearLocalStorage();
    clearResultsFromUI();
  }

  return (
    <div>
      <div id="main-content">
        <h1>Fun with AI</h1>
        <form onSubmit={onTextFormSubmit}>
          <label id="form-label"><strong>Enter prompt:</strong></label><br />
          <textarea rows="10" id="input_text"
            onChange={(e) => setInputText(e.target.value)}></textarea>
          <div id="select_inline">
            <Select placeholder="Data model (Optional)" options={dataModelOptions} styles={customStyles}
              onChange={(e) => setDataModel(e.value)}></Select>
          </div>
          <input disabled={!btnActive} id="submit-button" className="button" type="submit" value="Submit" />
        </form>
        {displayNotice ?
          <TextAnimation></TextAnimation>
          : null}
        {displayResponses ?
          <div id="responses">
            <h2>Responses:</h2>
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
