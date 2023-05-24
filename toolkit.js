const https = require('https');
const readline = require('readline');
const { exec, spawn } = require('child_process');
const { get } = require('http');


require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

var input = "";
var callerSubproc;

var TEMPERATURE = 0.6;
var MAX_TOKENS = 50;
var MODEL_TYPE = "gpt-3.5-turbo";

var playtoken = 0;

async function getInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (typed) => {
      resolve(typed);
    });
  });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
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
      process.exit();
    }else if (input === 'config') {
      await configSettings();
      promptUser();
      return;
    }else{
      processCall();
    }
  }

  function processCall(){
    console.log("creating output");
    callerSubproc = spawn('node', ['caller.js', input, TEMPERATURE, MAX_TOKENS, MODEL_TYPE]);

    callerSubproc.stdout.on('data', (data) => {
      process.stdout.write(`${data}`);
    });

    callerSubproc.on('close', (code) => {
      promptUser();
    });

    

  }


  
  console.log("\n-= CLI GPT Prompter =-");
  promptUser();
