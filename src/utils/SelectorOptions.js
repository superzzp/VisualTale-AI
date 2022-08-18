const inputDataModel = [
    { value: { text: 'text-davinci-002' }, label: 'Davinci (Default)' },
    { value: { text: 'text-curie-001' }, label: 'Curie' },
    { value: { text: 'text-babbage-001' }, label: 'Babbage' },
    { value: { text: 'text-ada-001' }, label: 'Ada' },
]

const promptPresets = [
    { value: { text: 'Write a science fiction where a famous chef opens a restaurant in space.', param: { temp: 0.7, maxLen: 256, topP: 1, freq: 0.3, pres: 0 } }, label: 'Write a story' },
    { value: { text: 'Write a three minutes speech about climate change.', param: { temp: 0.7, maxLen: 390, topP: 1, freq: 0.7, pres: 0 } }, label: 'Write a speech' },
    { value: { text: 'Write a poem about Canada.', param: { temp: 0.7, maxLen: 256, topP: 1, freq: 0, pres: 0 } }, label: 'Write a poem' },
    { value: { text: 'Summarize this for a second-grade student: \n\nJupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.', param: { temp: 0.7, maxLen: 64, topP: 1, freq: 0, pres: 0 } }, label: 'Summarize for a 2nd grader' },
    { value: { text: 'Translate this into 1. French, 2. Spanish and 3. Japanese: \n\nWhat rooms do you have available?', param: { temp: 0.3, maxLen: 100, topP: 1, freq: 0, pres: 0 } }, label: 'English to other languages' },
    { value: { text: 'Classify the sentiment in these tweets: \n\n1. \"I can\'t stand homework\"\n2. \"This sucks. I\'m bored 😠\"\n3. \"I can\'t wait for Halloween!!!\"\n4. \"My cat is adorable ❤️❤️\"\n5. \"I hate chocolate\"\n\nTweet sentiment ratings:', param: { temp: 0, maxLen: 60, topP: 1, freq: 0, pres: 0 } }, label: 'Analyze Tweets\' sentiment'},
    { value: { text: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?\nHuman: ', param: { temp: 0.9, maxLen: 150, topP: 1, freq: 0, pres: 0.6 } }, label: 'Chat' },
    { value: { text: 'Correct this to standard English: \n\nShe no went to the market.', param: { temp: 0, maxLen: 60, topP: 1, freq: 0, pres: 0 } }, label: 'Grammatical standard English' },
]

export {
    inputDataModel,
    promptPresets
}

