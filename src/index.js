// establishes dependencies on Client and IntentsBitField classes from discord.js using destructuring
const { Client, IntentsBitField } = require('discord.js');

const path = require('node:path');
const fs = require('fs');

// loads environment variables from the .env file containing the bot's token and model name
require('dotenv').config();

// initializes new Client object representing the discord bot
const bot = new Client({

    // initializes permissions for bot
    /*
     * helpful discord.js intents list: https://discord.com/developers/docs/topics/gateway#list-of-intents
     */
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// defines the path where event files are located
const eventsPath = path.join(__dirname, 'events');

// reads all event handler files ending with '.js' in the events directory
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'));

// iterates over each event file
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);

    // retrieves an event file's event object
    const event = require(filePath);

    // check if the event is meant to be executed only once
    if (event.once) {
        // executes the event and removes the event listener for the event
        bot.once(event.name, (...args) => event.execute(...args, bot));
    } else {
        // executes events, keeping the event listener
        bot.on(event.name, (...args) => event.execute(...args, bot));
    }
}

// logs into the bot using the token in .env
bot.login(process.env.TOKEN);
