const { call } = require('openai-toolkit');
const readline = require('readline');

require('dotenv').config();

const APIKEY = process.env.OPENAI_API_KEY;

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

  while(playtoken != "exit"){
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
    }
    console.log("");
}
return;
}

async function promptUser() {
    console.log("\nPlease enter a prompt for GPT");
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
    call(input, TEMPERATURE, MAX_TOKENS, MODEL_TYPE, "a", APIKEY, onData, onEnd);

    function onData(output) {
      process.stdout.write(output);
    }

    function onEnd() {
      promptUser();
    }

  }
  
  console.log("\n-= CLI GPT Prompter =-");
  promptUser();
