const https = require('https');
const readline = require('readline');

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

var input = "";

const startDelimiter = '{"content":"';
const endDelimiter = '"}';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

const req = https.request({
  hostname: "api.openai.com",
  port: 443,
  path: "/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    'Authorization': `Bearer ${apiKey}`,
  }
}, 

   function (res) {
   let responseData = '';

   res.on('data', (chunk) => {

    responseData = chunk.toString();
    if(responseData.indexOf("content") != -1){
        const inputString = responseData;

        const startIndex = inputString.indexOf(startDelimiter) + startDelimiter.length;
        const endIndex = inputString.indexOf(endDelimiter, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
            const content = inputString.substring(startIndex, endIndex);
            const output = content.replace(/\\n/g, '\n');
            process.stdout.write(output);
        } else {
            console.log('Content not found');
        }
   }
  });

  res.on('end', () => {
    console.log('\n\n --- \n\n');
    promptUser();
  });
});

req.on('error', (e) => {
  console.error("Problem with request")
});

async function promptUser() {
    console.log("Please enter a prompt for GPT");
    console.log("type 'exit' to close");
    rl.question('-> ', async (input) => {
      if (input === 'exit') {
        console.log('Terminated.');
        rl.close();
        return;
      }
  
      const body = JSON.stringify({
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.6,
        max_tokens: 35,
        stream: true
      });
      
      console.log("-- query response --\n");

      req.write(body);
      req.end();
    
    });
  }
  
  console.log("\n-= CLI GPT Prompter =-");
  promptUser();
