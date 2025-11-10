import readlineSync from "readline-sync";
import { tools } from "./tools.js";
import { addChatMessage } from "./service.js";
import { generateContent } from "./ai.js";

async function main() {
  while (true) {
    const input = readlineSync.question("You >>> ");
    await addChatMessage({
      role: "user",
      message_type: "input",
      content: input,
    });

    while (true) {
      const result = await generateContent();
      const action = result;

      if (action.type === "output") {
        await addChatMessage({
          role: "model",
          message_type: "output",
          content: action,
        });
        console.log(`Bot >>> ${action.output}`);
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
}

main();