# GPT Prompter
This is a Node.js command-line application that prompts the user for input and interacts with the GPT (Generative Pre-trained Transformer) model. It allows you to customize various settings and receive model-generated responses based on your prompts. It will also give you an estimated amount of tokens that were used for the query, as well as an aproximate price. 

## Prerequisites
To run this application, ensure you have the following installed:

Node.js
npm (Node Package Manager)

## Installation
Clone this repository or download the source code files.
Navigate to the project directory in your terminal.
Install the required dependencies by running the following command:

```npm install```

create a .env file and add the following line:

```OPENAI_API_KEY=<Your-OpenAI-Key>```

You can get your key here: https://platform.openai.com/account/api-keys

## Usage
Open your terminal and navigate to the project directory.

### toolkit.js
Run the following command to start the CLI GPT Prompter:

```node toolkit.js```

Follow the prompts displayed in the terminal:

Enter a prompt for the GPT model. You will receive a generated response based on this input.
Type config to edit the settings:
Select 1 to configure the temperature setting.
Select 2 to configure the max_tokens setting.
Select 3 to configure the model setting.
Type exit to exit the configuration menu.
The generated output from the GPT model will be displayed in the terminal.

You can continue entering prompts or customize settings as desired.

### caller.js

```caller.js``` is a barebones nodeJS file that handles the API communication between toolkit.js and the openAI API.
you can implement this program in your GPT-related projects by just calling it and copying the streamed output.

#### Usage

```node caller.js <question> <temperature> <max tokens> <model> ```

The program will stream the live output from the openAI API and print it in the console

for example:

```node caller.js "what is cheese" 0.6 50 "gpt-3.5-turbo"```

## Configuration Settings
The CLI GPT Prompter allows you to customize the following settings:

Temperature: Controls the randomness of the generated output. Higher values (e.g., 0.8) produce more random output, while lower values (e.g., 0.2) produce more deterministic output.

Max Tokens: Specifies the maximum number of tokens in the generated output. Higher values allow for longer responses, but be aware that GPT models have a maximum token limit.

Model Type: Sets the model type to be used. The default value is "gpt-3.5-turbo".
The available options are ```gpt-4```, ```gpt-4-0314```, ```gpt-4-32k```, ```gpt-4-32k-0314```, ```gpt-3.5-turbo```, and ```gpt-3.5-turbo-0301```.
 
## License
This project is licensed under the MIT License.

## Disclaimer
Please note that this application interacts with GPT models and relies on an API key or access to an appropriate GPT model. Ensure that you have the necessary authorization and comply with the terms of use for the specific GPT model you are using.

## Contributing
Contributions to improve this CLI GPT Prompter are welcome! Feel free to open issues or submit pull requests to address bugs, add new features, or enhance the existing functionality.

## Authors
Jovan Milicev
