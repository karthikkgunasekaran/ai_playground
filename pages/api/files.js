import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import { IncomingForm } from "formidable";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {

  const configuration = new Configuration({
    apiKey: req.headers["auth-openai-apikey"] || process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

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
      const listFiles = await openai.listFiles();
      res.status(200).json(listFiles.data);
    } catch (error) {
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
    const form = new IncomingForm({ multiples: false });
    const parseFormData = () =>
      new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('Error parsing form data:', err);
            reject(err);
            return;
          }
          resolve(files);
        });
      });

    try {
      const files = await parseFormData();
      const file = files && files.file;
      if (!file) {
        res.status(400).json({
          error: {
            message: 'No file uploaded.',
          },
        });
        return;
      }
      try {
        const folderPath = path.dirname(file.filepath);
        const newFilePath = path.join(folderPath, file.originalFilename);
        fs.rename(file.filepath, newFilePath, (err) => {
          if (err) {
            console.error('Error renaming file:', err);
          } else {
            console.log('File renamed successfully');
          }
        });
        const uploadResponse = await openai.createFile(fs.createReadStream(newFilePath), 'fine-tune');
        res.status(200).json(uploadResponse.data);
      }
      catch (error) {
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
    catch (error) {
      console.error(`Error parsing form data: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during form data parsing.',
        },
      });
    }

  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


