const inputDataModel = [
    { value: 'text-davinci-002', label: 'Davinci (Default)' },
    { value: 'text-curie-001', label: 'Curie' },
    { value: 'text-babbage-001', label: 'Babbage' },
    { value: 'text-ada-001', label: 'Ada' },
]

const promptPresets = [
    { value: 'Write a science fiction where Gordon Ramsay opens a restaurant in space.', label: 'Write a story'},
    { value: 'Write a three minute speech about climate change.', label: 'Write a speech'},
    { value: 'Write a poem about Canada.', label: 'Write a poem'},
    { value: 'Summarize this for a second-grade student: \n\nJupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.', label: 'Summarize for a 2nd grader' },
    { value: 'Translate this into 1. French, 2. Spanish and 3. Japanese: \n\nWhat rooms do you have available?\n\n1.', label: 'English to other languages' },
    { value: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ', label: 'Chat' },
]

export {
    inputDataModel, 
    promptPresets
}

