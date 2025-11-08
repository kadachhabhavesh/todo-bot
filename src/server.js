import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import { SYSTEM_PROMPT } from "./constant.js";
import { tools } from "./tools.js";
import { addTodo, deleteTodoById, getAllTodos, searchTodo } from "./service.js";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAIKrxQtujJTosydNXPzJllI89O3oW5S60",
});

const generateContent = async (messages) => {
  const formatted = messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content || "" }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formatted,
    });
    let outputText = response.candidates[0].content.parts[0].text;
    console.log("----- AI RAW OUTPUT -----");
    console.log(outputText);
    console.log("-------------------------");

    if (!outputText) {
      throw new Error("no text found in response.");
    }

    return outputText;
  } catch (error) {
    console.error("Error during AI model call:", error);
    throw error;
  }
};

async function main() {
  const messages = [
    {
      role: "user",
      content: `System instructions:\n${SYSTEM_PROMPT}\n---\nUser: start conversation.`,
    },
  ];

  while (true) {
    const input = readlineSync.question("You >>> ");
    const userMessage = {
      type: "user",
      user: input,
    };
    messages.push({ role: "user", content: JSON.stringify(userMessage) });

    while (true) {
      const result = await generateContent(messages);
      messages.push({ role: "model", content: result });
      const action = JSON.parse(result);

      if (action.type === "output") {
        console.log(`Bot >>> ${action.output}`);
        break;
      } else if (action.type === "action") {
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
          messages.push({
            role: "user",
            content: JSON.stringify(observationMessage),
          });
        } catch (error) {
          console.error("Error during tool execution:", error);
          break;
        }
      }
    }
  }
}

main();

