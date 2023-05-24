import Error from "next/error";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: any, res: any) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const input = req.body.input || "";
  if (input.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid input",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(input),
      temperature: 1,
      max_tokens: 400,
    });
    if (completion.data.choices[0]) {
      res.status(200).json({ result: completion.data.choices[0].text });
    }
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
  let prompt = generatePrompt(input);
  console.log(prompt);
}

function generatePrompt(input: any) {
  return `Generate a trade plan for the following input with a new line between each step:

  Input: AAPL calls over 174.50, puts under 173 
  Response: 
  AAPL Calls: 
  1. Enter AAPL calls over 174.50 and set stop loss at 174. 
  2. Place profit target at 175 and adjust depending on price action. 
  
  AAPL Puts:
  1. Enter AAPL puts under 173 and set stop loss at 173.50. 
  2. Place profit target at 172.50 and adjust depending on price action. 

Input: ${input}
Response:`;
}
