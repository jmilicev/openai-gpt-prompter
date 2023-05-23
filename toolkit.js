const https = require('https');
const readline = require('readline');
const { exec } = require('child_process');
const { get } = require('http');


require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

var input = "";
var rctoken = 0;
var trtoken = 0;

var TEMPERATURE = 0.6;
var MAX_TOKENS = 50;
var MODEL_TYPE = "gpt-3.5-turbo";

var playtoken = 0;


//CONSTANTS
const startDelimiter = '{"content":"';
const endDelimiter = '"}';
const gpt35turbo_RATE = 0.000002; //per 1 token

async function getInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (typed) => {
      resolve(typed);
    });
  });
}

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


async function configSettings() {
  console.log("\n-= CLI GPT Settings =-");
  console.log("temp = " + TEMPERATURE + " | m-t = " + MAX_TOKENS + " | mdl = " + MODEL_TYPE);
  console.log("type 'exit' to close\n");
  console.log("1 - temperature");
  console.log("2 - max_tokens");
  console.log("3 - model");

  playtoken = await getInput("-> ");

  if(playtoken == 1){
    console.log("enter temperature: ");
    TEMPERATURE = await getInput("-> ");
  }else if(playtoken == 2){
    console.log("enter max tokens: ");
    MAX_TOKENS = await getInput("-> ");
  }else if(playtoken == 2){
    console.log("enter model: ");
    MODEL_TYPE= await getInput("-> ");
  }else if(playtoken == "exit"){
    return;
  }
  console.log("");
  return;
}





async function promptUser() {
    rctoken = 0;
    trtoken = 0;
    console.log("Please enter a prompt for GPT");
    console.log("type 'exit' to close");
    console.log("type 'config' to edit settings");

    input = await getInput("-> ");

    if (input === 'exit') {
      console.log('Terminated.');
      return;
    }else if (input === 'config') {
      await configSettings();
      promptUser();
      return;
    }else{
      const body = JSON.stringify({
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
        model: MODEL_TYPE,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
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
  }
  }
  
  console.log("\n-= CLI GPT Prompter =-");
  promptUser();
