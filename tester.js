const { exec } = require('child_process');

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

const text = "what is the average weight of a crocodile";

estimateTokenCount(text)
  .then((tokenCount) => {
    console.log("Token count:", tokenCount);
  })
  .catch((error) => {
    console.error("Error estimating token count:", error.message);
  });
