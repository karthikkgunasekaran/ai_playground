import { Configuration, OpenAIApi } from "openai";
import fs from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (req.method === 'GET') {
    if (!configuration.apiKey) {
      res.status(500).json({
        error: {
          message: "OpenAI API key not configured, please follow instructions in README.md",
        }
      });
      return;
    }
    try {
      const listFineTunes = await openai.listFineTunes();
      res.status(200).json(listFineTunes.data);
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
  } else if (req.method === 'POST') {
    try {
      const fileId = req.body.fileId || '';

      const fineTuneCreationResponse = await openai.createFineTune({
        training_file: fileId,
        model: 'ada'
      });
      console.log(fineTuneCreationResponse);
      // Handle the response or update the state as needed
      res.status(200).json(fineTuneCreationResponse.data);
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
  } else {
    // Handle other HTTP verbs
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


