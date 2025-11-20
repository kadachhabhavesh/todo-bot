import express from "express";
import ServerlessHttp from "serverless-http";
import { handleUserInput } from "./ai.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  
  const { input } = req.body;
  try {
    const LLMResponse = await handleUserInput(input);
    res.json({ isSuccess: true, data: LLMResponse });
  } catch (error) {
    res.json({ isSuccess: false, data: "something went wrong" });
  }
});

app.listen(3000); 
// export const handler = ServerlessHttp(app)
