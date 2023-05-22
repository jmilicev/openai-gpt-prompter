const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;


//use this resource for endpoints
// https://platform.openai.com/docs/models/model-endpoint-compatibility
// 
// this one shows the price:
// https://openai.com/pricing

const client = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
});

async function query(prompt) {
    try {
      const response = await client.post('chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
  
      const message = response.data.choices[0].message.content;
      for (let i = 0; i < message.length; i++) {
        process.stdout.write(message[i]);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (error) {
      console.error('Error querying model', error);
    }
  }

(async () => {
  const prompt = 'What is the capital of France?';
  const response = await query(prompt);
  console.log(`query response: ${response}`);
})();