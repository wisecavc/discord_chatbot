const { Events } = require('discord.js');
const { exec } = require('child_process');
const fs = require('fs');

// path to memory.json, where the bot's memory is stored
const mem_fp = 'src/events/utils/memory.json';

/*
 * function to reset memory.json on startup
 */
function wipe_memory() {

    // establishes new empty memory.json template
    const template = {
        "model": String(process.env.MODEL),
        "messages": [],
        "stream": false
    };

    // writes the template into memory.json
    fs.writeFile(mem_fp, JSON.stringify(template, null, 2), (err) => {
        if (err) {
            console.error('Error writing reset copy to memory.json: ', err);
        } else {
            console.log('Memory reset and initialized.');
        }
    });
};

// defines an object representing the event handler for the 'ClientReady' event
module.exports = {
    name: Events.ClientReady,
    once: true,  // specifies that this event should be executed only once

    // executes when the bot is started and logs in
    execute(client) {
        
        // wipes any old messages from previous conversations
        wipe_memory();

        // logs a message of which model is attemppting to run
        console.log(`Attempting to run model ${String(process.env.MODEL)} with Ollama...`);

        try {
        // runs the cmd command that initializes the Ollama model defined in the .env file
        exec(`ollama run ${String(process.env.MODEL)}`);
        } catch (error) {
            // logs errors
            console.error('Error encountered when initializing the model in Ollama: ', error);
        };
        
        // Log a message indicating that the bot is logged in and ready
        console.log(`Ready! Logged in as ${client.user.tag}.\n`);
    },
};