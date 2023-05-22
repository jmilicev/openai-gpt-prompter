const https = require('https');

const prompt = "Please list the specs of a 2018 honda cb500fa";

const startDelimiter = '{"content":"';
const endDelimiter = '"}';

const body = JSON.stringify({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.6,
    max_tokens: 35,
    stream: true
  });
  
const req = https.request({
  hostname: "api.openai.com",
  port: 443,
  path: "/v1/chat/completions",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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"
  }
}, function (res) {
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
        process.stdout.write(output); // Output: London
        } else {
        console.log('Content not found');
}

   }
  });

  res.on('end', () => {
    console.log('\n\n --- \n\n');
  });
});

req.on('error', (e) => {
  console.error("Problem with request")
  //console.error("Problem with request: " + e.message);
});

req.write(body);
req.end();
