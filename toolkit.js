const axios = require('axios');
const readline = require('readline');

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
});

async function query(prompt, model) {
  try {
    const response = await client.post('chat/completions', {
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const message = response.data.choices[0].message.content;
    return message;
  } catch (error) {
    console.error('Error querying model', error);
  }
}

function promptUser() {
  console.log("Please enter a prompt for GPT");
  rl.question('-> ', async (input) => {
    if (input === 'exit') {
      console.log('Terminated.');
      rl.close();
      return;
    }

    const response = await query(input, 'gpt-3.5-turbo');
    console.log("-- query response --");
    console.log(response+"\n");
    promptUser();
  });
}

console.log("\n-= CLI GPT Prompter =-");
console.log("type 'exit' to close");
promptUser();
