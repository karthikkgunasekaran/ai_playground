import { Configuration, OpenAIApi } from "openai";
import fs from "fs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (req.method === 'POST') {
    try {
      const fileName = req.body.fileName || 'sampleData.jsonl';

      // Call OpenAI's upload file API
      const uploadResponse = await openai.createFile(
        fs.createReadStream(fileName),
        "fine-tune"
      );

      // Handle the response or update the state as needed
      res.status(200).json(uploadResponse.data);
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


