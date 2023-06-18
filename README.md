# OpenAI API Playground

This is playground app built to explore the  OpenAI APIs, importantly Fine-Tuned models. It is built on top of OpenAI [quickstart tutorial](https://platform.openai.com/docs/quickstart). It uses the [Next.js](https://nextjs.org/) framework with [React](https://reactjs.org/). Follow the instructions below to get set up.

![Text box that says name my pet with an icon of a dog](https://raw.githubusercontent.com/karthikkgunasekaran/ai_playground/master/output/playground_completion_mrcool_sample.jpg)

## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory
4. Install the requirements

   ```bash
   $ npm install
   ```

5. Set your [OpenAI API key](https://platform.openai.com/account/api-keys) through Settings in the User Interface after setup or alternatively set the API key in the .env file. To set it in the .env file, follow the below steps.
   Make a copy of the example environment variables file

   On Linux systems: 
   ```bash
   $ cp .env.example .env
   ```
   On Windows:
   ```powershell
   $ copy .env.example .env
   ```
   Add your API Key to the newly created `.env` file

6. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000)! 