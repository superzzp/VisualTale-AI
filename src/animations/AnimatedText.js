import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

export default function TextAnimation() {

  const prompt = "Write a prompt for an ice cream shop.";
  const poem = "Write a poem about Canada.";
  const translation = "Translate this into Japanese: What rooms do you have available?";
  const summarization = "Summarize the history of the Earth in a paragraph.";
  const question = "What can we do every day to stop climate change?";


  const prompts = [prompt, poem, translation, summarization, question]

  const [item, setItem] = useState(prompt);
  const [count, setCount] = useState(0);

  const MINUTE_MS = 6000; // six seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount == prompts.length - 1) {
          setItem(prompts[0]);
          return 0;
        } else {
          const currCount = prevCount + 1;
          setItem(prompts[currCount]);
          return currCount;
        }
      })
    }, MINUTE_MS);
    return () => clearInterval(interval);
  }, [])

  return <div>
    <h2>Ask me anything:</h2>
    <Wrapper>{item}</Wrapper>
  </div>
}

const animation = keyframes`
  0% { opacity: 0; transform: translateY(-100px) skewX(10deg) skewY(10deg) rotateZ(30deg); filter: blur(10px); }
  25% { opacity: 1; transform: translateY(0px) skewX(0deg) skewY(0deg) rotateZ(0deg); filter: blur(0px); }
  75% { opacity: 1; transform: translateY(0px) skewX(0deg) skewY(0deg) rotateZ(0deg); filter: blur(0px); }
  100% { opacity: 0; transform: translateY(-100px) skewX(10deg) skewY(10deg) rotateZ(30deg); filter: blur(10px); }
  `

const Wrapper = styled.span`
  animation-name: ${animation};
  animation-duration: 6s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  font-size: 24px;
`