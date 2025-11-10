import express from "express";
import ServerlessHttp from "serverless-http";
import { handleUserInput } from "./ai.js";
import { formateResponse } from "./util.js";

const app = express();

app.use(express.json());

app.use("/test", (req, res) => {
  res.send("done");
});
app.post("/chat", async (req, res) => {
  const { input } = req.body;
  try {
    const LLMResponse = await handleUserInput(input);
    res.json({ isSuccess: true, ...formateResponse(LLMResponse) });
  } catch (error) {
    res.json({ isSuccess: false, reply: "something went wrong" });
  }
});

app.listen(3000);
// export const handler = ServerlessHttp(app)
