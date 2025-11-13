import { llmResponseToJson } from "./ai.js";

export const formateResponse = async (response) => {
  const formatedResponse = await llmResponseToJson(response)
  console.log(formatedResponse.slice(7,formatedResponse.length-4));
  return JSON.parse(formatedResponse.slice(7,formatedResponse.length-4))
};
