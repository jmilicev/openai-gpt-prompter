const https = require('https');
const readline = require('readline');
const { exec } = require('child_process');
const { get } = require('http');

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

var rctoken = 0;
var trtoken = 0;

var potentialErrorString = "";

// Retrieve command line arguments
const args = process.argv.slice(2);


const INPUT = args[0];
const TEMPERATURE = parseFloat(args[1]);
const MAX_TOKENS = parseInt(args[2]);
const MODEL_TYPE = args[3];
const ANALYTICS = args[4];


var playtoken = 0;

//CONSTANTS
const startDelimiter = '{"content":"';
const endDelimiter = '"}';
const gpt35turbo_RATE = 0.000002; //per 1 token

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
    //uncomment this to debug why it is blank
    //console.log(chunk.toString());
    potentialErrorString += responseData;
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
    

    if(rctoken == 0){
        //if no "content" messages were sent,
        // dump the comms to display potential error
        console.log("\n\nERROR DETECTED: ")
        console.log("LIKELY API KEY / API ISSUE\n")
        console.log(potentialErrorString+"\n\n");
        console.log("\n\nEND ERROR")
    }else if(ANALYTICS == "-a"){
    //PLEASE NOTE THESE ARE ESTIMATIONS, AND ARE NOT
    // ALWAYS 100% ACCURATE!
        console.log('\n\n -- analytics --');
        console.log("prompt tokens spent: "+trtoken);
        console.log("completion tokens spent: "+rctoken);
        console.log("total tokens spent: "+(totaltokens))
        console.log("estimated cost: ¢"+priceinCENTS.toFixed(3))
        console.log(' ---- ---- ---- \n');
    }else{
        console.log('\n ---- ---- ---- \n\n');
    }
  });
});

req.on('error', (e) => {
  
  console.error("Problem with request"+ e)
});


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

  function processCall(){

    if(ANALYTICS == "-a"){
        estimateTokenCount(INPUT)
        .then((tokenCount) => {
            trtoken = tokenCount
        })
        .catch((error) => {
            console.error("Error estimating token count:", error.message);
        });
    }
    var body = JSON.stringify({
      messages: [
        {
          role: 'user',
          content: INPUT,
        },
      ],
      model: MODEL_TYPE,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      stream: true
    });
    
    console.log("\n -- GPT: --");
    console.log("temp = " + TEMPERATURE + " | m-t = " + MAX_TOKENS + " | mdl = " + MODEL_TYPE+"\n");

    req.write(body);
    req.end();
  }
  
processCall()