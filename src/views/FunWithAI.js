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
            <div>
              <button className={["regular-button"].join(" ")}>
                <svg className="info" stroke="currentColor" fill="currentColor" width="1em" height="1em" viewBox="0 0 80 80"  xmlns="http://www.w3.org/2000/svg"> 
                  <path d="M39.8202 79.1504C45.2238 79.1504 50.302 78.125 55.0546 76.0742C59.8072 74.0234 63.9983 71.1751 67.6279 67.5293C71.2574 63.8834 74.1057 59.6842 76.1728 54.9316C78.2398 50.179 79.2734 45.1172 79.2734 39.7461C79.2734 34.375 78.2398 29.3132 76.1728 24.5605C74.1057 19.8079 71.2492 15.6087 67.6034 11.9629C63.9576 8.31703 59.7584 5.46873 55.0058 3.418C50.2532 1.3672 45.175 0.341797 39.7714 0.341797C34.4003 0.341797 29.3385 1.3672 24.5859 3.418C19.8333 5.46873 15.6503 8.31703 12.037 11.9629C8.42369 15.6087 5.58353 19.8079 3.51647 24.5605C1.44942 29.3132 0.415894 34.375 0.415894 39.7461C0.415894 45.1172 1.44942 50.179 3.51647 54.9316C5.58353 59.6842 8.43182 63.8834 12.0614 67.5293C15.691 71.1751 19.8821 74.0234 24.6347 76.0742C29.3873 78.125 34.4491 79.1504 39.8202 79.1504ZM39.8202 71.7285C35.3931 71.7285 31.2509 70.9066 27.3935 69.2627C23.536 67.6188 20.1506 65.332 17.2372 62.4023C14.3238 59.4726 12.0451 56.071 10.4013 52.1973C8.75739 48.3236 7.93545 44.1732 7.93545 39.7461C7.93545 35.319 8.74925 31.1686 10.3769 27.2949C12.0045 23.4212 14.275 20.0195 17.1884 17.0898C20.1018 14.1601 23.4872 11.8734 27.3446 10.2295C31.202 8.58563 35.3443 7.7637 39.7714 7.7637C44.231 7.7637 48.3896 8.58563 52.247 10.2295C56.1044 11.8734 59.4979 14.1601 62.4277 17.0898C65.3573 20.0195 67.6522 23.4212 69.3124 27.2949C70.9726 31.1686 71.8027 35.319 71.8027 39.7461C71.8027 44.1732 70.9807 48.3236 69.3368 52.1973C67.6929 56.071 65.4143 59.4726 62.5009 62.4023C59.5875 65.332 56.1939 67.6188 52.3202 69.2627C48.4465 70.9066 44.2798 71.7285 39.8202 71.7285Z"/>
                  <path d="M33.2284 60.8887H48.7558C49.6346 60.8887 50.3752 60.6039 50.9775 60.0342C51.5797 59.4645 51.8808 58.7402 51.8808 57.8613C51.8808 57.015 51.5797 56.2988 50.9775 55.7129C50.3752 55.127 49.6346 54.834 48.7558 54.834H44.4589V36.5723C44.4589 35.3678 44.1659 34.4075 43.58 33.6914C42.994 32.9753 42.164 32.6172 41.0898 32.6172H33.9609C33.0819 32.6172 32.3332 32.9102 31.7148 33.4961C31.0962 34.082 30.787 34.7982 30.787 35.6445C30.787 36.5234 31.0962 37.2559 31.7148 37.8418C32.3332 38.4277 33.0819 38.7207 33.9609 38.7207H37.5253V54.834H33.2284C32.3495 54.834 31.6008 55.127 30.9823 55.7129C30.3638 56.2988 30.0546 57.015 30.0546 57.8613C30.0546 58.7402 30.3638 59.4645 30.9823 60.0342C31.6008 60.6039 32.3495 60.8887 33.2284 60.8887ZM39.4296 26.6602C40.9595 26.6602 42.2453 26.1231 43.287 25.0488C44.3286 23.9746 44.8495 22.6725 44.8495 21.1426C44.8495 19.6127 44.3286 18.3106 43.287 17.2363C42.2453 16.1621 40.9595 15.625 39.4296 15.625C37.8996 15.625 36.6057 16.1621 35.5478 17.2363C34.4898 18.3106 33.9609 19.6127 33.9609 21.1426C33.9609 22.6725 34.4898 23.9746 35.5478 25.0488C36.6057 26.1231 37.8996 26.6602 39.4296 26.6602Z"/>
                </svg>
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
