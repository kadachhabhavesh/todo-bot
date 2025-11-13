import dotenv from "dotenv";
dotenv.config();
import readlineSync from "readline-sync";
import { tools } from "./tools.js";
import { addChatMessage } from "./service.js";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
import { FORMATE_LLM_RESPONSE_PROMPT, SYSTEM_PROMPT } from "./constant.js";
import { getPreviousChat } from "./service.js";
import { formateResponse } from "./util.js";

export const generateContent = async () => {
  const chatHistory = await getPreviousChat();
  let formatted = chatHistory.map((chathis) => ({
    role: chathis.role,
    parts: [{ text: chathis.content || "" }],
  }));
  formatted = [
    {
      role: "user",
      parts: [{ text: `System instructions:\n${SYSTEM_PROMPT}\n` }],
    },
    ...formatted,
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formatted,
    });
    let outputText = response.candidates[0].content.parts[0].text;
    console.log(":::LLM:::"+outputText);

    if (!outputText) {
      throw new Error("no text found in response.");
    }

    return JSON.parse(outputText);
  } catch (error) {
    console.error("Error during AI model call:", error);
    throw error;
  }
};

export const handleUserInput = async (userInput) => {
  while (true) {
    // const userInput = readlineSync.question("You >>> ");
    await addChatMessage({
      role: "user",
      message_type: "input",
      content: userInput,
    });

    while (true) {
      const result = await generateContent();
      const action = result;
      
      if (action.type === "output") {
        // const formatedOutput = await llmResponseToJson(action.output)
        await addChatMessage({
          role: "model",
          message_type: "output",
          // content: {...action, output: formatedOutput.slice(7,formatedResponse.length-4)},
          content: action,
        });
        // console.log(`Bot >>> ${action.output}`);
        // return formatedOutput.slice(7,formatedResponse.length-4);
        return action
        break;
      } else if (action.type === "action") {
        await addChatMessage({
          role: "model",
          message_type: "action",
          content: action,
        });
        const fn = tools[action.function];
        if (!fn) {
          console.log("Invalid function call:", action.function);
          break;
        }

        try {
          const observation = await fn(action.input);
          const observationMessage = {
            type: "observation",
            observation: observation,
          };
          await addChatMessage({
            role: "user",
            message_type: "observation",
            content: observationMessage,
          });
        } catch (error) {
          console.error("Error during tool execution:", error);
          break;
        }
      }
    }
  }
};

export const llmResponseToJson = async (llmResponse) => {
  const formattedLLMResponse = [
    {
      role: "user",
      parts: [
        {
          text: `System instructions:\n${FORMATE_LLM_RESPONSE_PROMPT}\n---\nHere is the model's raw output:\n${llmResponse}`,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedLLMResponse,
    });
    let outputText =
      response.text && response.candidates[0].content.parts[0].text;
    // console.log("::JSON::" + outputText);

    if (!outputText) {
      throw new Error("no text found in response.");
    }

    return outputText;
  } catch (error) {
    console.error("Error during AI model call:", error);
    throw error;
  }
};
