import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {

  const configuration = new Configuration({
    apiKey: req.headers["auth-openai-apikey"] || process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  const modelName = req.body.model || 'text-ada-001';
  const temperature = req.body.temperature || 0.5;
  const maxTokens = req.body.maxTokens || 20;
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: modelName,
      prompt: prompt,
      temperature: temperature,
      max_tokens: maxTokens
    });
    res.status(200).json({ result: completion.data.choices[0].text });
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
}