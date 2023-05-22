const https = require('https');
const readline = require('readline');
const { exec } = require('child_process');


require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

var input = "";
var rctoken = 0;
var trtoken = 0;

const startDelimiter = '{"content":"';
const endDelimiter = '"}';
const gpt35turbo_RATE = 0.000002;

function estimateTokenCount(text) {
    return new Promise((resolve, reject) => {
      const command = `python3 estimate-tokens.py "${text}"`;
  
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('Error estimating token count:', error);
          reject(error);
        } else {
          const tokenCount = parseInt(stdout.trim());
          resolve(tokenCount);
        }
      });
    });
  }

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

        rctoken ++;
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
    const totaltokens = rctoken+trtoken;
    const priceinCENTS = totaltokens * gpt35turbo_RATE * 100;
    
    //PLEASE NOTE THESE ARE ESTIMATIONS, AND ARE NOT
    // ALWAYS 100% ACCURATE!
    console.log('\n\n -- analytics --');
    console.log("prompt tokens spent: "+trtoken);
    console.log("completion tokens spent: "+rctoken);
    console.log("total tokens spent: "+(totaltokens))
    console.log("estimated cost: ¢"+priceinCENTS)
    console.log('\n ---- ---- ---- \n\n');
    promptUser();
  });
});

req.on('error', (e) => {
  console.error("Problem with request")
});

async function promptUser() {
    rctoken = 0;
    trtoken = 0;
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

      estimateTokenCount("what time is it today")
      .then((tokenCount) => {
          trtoken = tokenCount
      })
      .catch((error) => {
          console.error("Error estimating token count:", error.message);
      });
      
      console.log("-- query response --\n");

      req.write(body);
      req.end();
    
    });
  }
  
  console.log("\n-= CLI GPT Prompter =-");
  promptUser();
