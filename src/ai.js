import dotenv from "dotenv"
dotenv.config();

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
import { SYSTEM_PROMPT } from "./constant.js";
import { getPreviousChat } from "./service.js";

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
    console.log("::LLM::"+outputText);

    if (!outputText) {
      throw new Error("no text found in response.");
    }

    return JSON.parse(outputText);
  } catch (error) {
    console.error("Error during AI model call:", error);
    throw error;
  }
};