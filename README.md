# Discord Chatbot using Ollama
### Developed by Cade Wisecaver
### Last updated October 12th, 2024


## About This Code

This program allows users to host a Discord chatbot which generates its responses using a locally-hosted language model ran with a local copy of Ollama.

The program functions as a link between the Discord API and the locally-hosted language model, it itself does not contain any code capable of prompt-to-text generation.

Frequent comments and a descriptive instruction section in the ReadMe are intended to help users who are not well-versed in code use, update, and edit it.

This code was written using Windows, and likely does not work with any other operating system, though this hasn't been tested.


## Instructions for Use

To use this program, users must take the following steps:

1. Install Ollama and a language model of your choice using Ollama's commands run from the command line (cmd). See the Citations section for helpful resources when working with Ollama commands.
2. Make a customized GGUF model using Ollama's commands. It is important that this model is named during the creation process. A template for creating the model is provided in this repository (GGUFtemplate), and once updated can be used to create the model if it's placed in the user directory (C:\Users\ {your username} ). The created model should also be kept in the user directory.
3. Record the name of the GGUF model you created into the MODEL variable of the .env file in this repository.
4. Create an application with the Discord Developer Portal and retrieve it's key.
5. Add the application key to the KEY variable of the .env file. Make sure to save the file.
6. Start the node server from a terminal by running the command "nodemon" while the repository for this project is the current repository.


## Useage Intent

This code is intended to demonstrate my ability to create an efficient pipeline between 2 applications using JavaScript to any prospective employers.

It is entirely free to use and open source, provided users follow the terms and conditions of both Discord and Ollama.


## Requirements

To run this code, users will need the Discord.js API, as well as the key of a Discord application to function as the chatbot.
Discord applications (referred to as bots in this description) are managed through the Discord Developer Portal, which can be found here: https://discord.com/developers/applications

Additionally, users will need access to a local installation of Ollama, and a local copy of a large language model to run with Ollama (which can be installed with commands once Ollama is installed). The Ollama API is not required to run this code.
This code uses Ollama 0.3.11. Future versions of Ollama have not been tested.
Ollama's site can be found here: https://ollama.com/

Users should consult Discord and Ollama's sites for computational requirements and instructions for getting started with their products.


## Citations

This code's development started out based on tutorial videos. Their involvement is limited to instructions regarding the use of Discord.js, and they only provided the rough framework for setting up the client for the bot.
The main tutorial used, by Under Ctrl, can be found here: https://youtu.be/KZ3tIGHU314?si=ByM0ibGKZRpIqFeS
The following resource, documentation for intents in discord.js, was retrieved and consulted from the tutorial above: https://discord.com/developers/docs/topics/gateway#list-of-intents

ChatGPT had some influence in the development of this code, but was not involved in the bulk of the work. ChatGPT's contribution is limited to infrequent syntax correction for certain JavaScript functions. It had no involvement whatsoever on code structure.

To make Discord.js and Ollama easier to understand, I consulted their documentation. Both can be found here:
Discord.js: https://discord.js.org/docs/packages/discord.js/main
Ollama: https://github.com/ollama/ollama