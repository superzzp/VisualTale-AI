// middleware for handling text completion
function textCompletion(inputText, selectedMaxResTokenLength, selectedTemperature, selectedTopP, selectedFreqPenalty, selectedPresPenalty, selectedDataModel) {
    // Proxy server that handle api calls to OpenAI, to protect API credentials
    // Check https://github.com/superzzp/OpenAI-Services for server side code repo
    const url = "https://openai-text-generation.herokuapp.com/openai/completions/3.0";
    // const local_url = "http://localhost:4000/openai/completions/3.0"
    return fetch(url, {
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
}

// middleware for handling image generation
function imageGeneration(textPrompt) {
  // Proxy server that handle api calls to OpenAI, to protect API credentials
  // Check https://github.com/superzzp/OpenAI-Services for server side code repo
  const url = "https://openai-text-generation.herokuapp.com/openai/generations";
  // const local_url = "http://localhost:4000/openai/generations"
  return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          "prompt": textPrompt
        })
    })
}

export const OpenAIServices = {
    textCompletion,
    imageGeneration
}