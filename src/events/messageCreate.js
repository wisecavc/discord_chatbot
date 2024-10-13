const { Events, ActivityType } = require('discord.js');
const fs = require('fs');

// path to memory.json, where the bot's memory is stored
const mem_fp = 'src/events/utils/memory.json';

// defines the URL for the default port Ollama uses
const url = 'http://localhost:11434/api/chat';

/*
 * adds a user's message to memory.json
 * only the 2 latest messages sent are kept
 */
function add_to_mem(msg) {

    // promise used to record errors
    return new Promise((resolve, reject) => {
        
        // reads current memory in memory.json
        fs.readFile(mem_fp, 'utf8', (err, data) => {

            if (err) {
                // logs errors and rejects promise on error
                console.error('Error reading memory.json: ', err, '\n');
                return reject(err);
            };

            // defines variable that will contain memory data
            let memData;
            try {
                // parses the read data from memory.json and records it in memData
                memData = JSON.parse(data);
            } catch (err) {
                console.error('Error parsing memory.json: ', err, '\n');
                return reject(err);
            };

            // create a new message object to add to memory
            const new_msg = {
                role: 'user',
                content: msg,
            };

            // adds the new message to the message array read from memory.json
            memData.messages.push(new_msg);

            // checks if there are more than 2 messages in the array
            if (memData.messages.length > 2) {
                // removes the oldest message (the first one in the array)
                memData.messages.shift();
            };

            // writes the updated message array back into memory.json
            fs.writeFile(mem_fp, JSON.stringify(memData, null, 2), (err) => {
                if (err) {
                    // logs errors
                    console.error('Error writing to JSON file:', err, '\n');
                    return reject(err);
                };
                // logs a message indicating success
                console.log('Message added to memory\n');
                // resolves the completed promise
                resolve();
            });
        });
    });
}

/*
 * handles sending new messages
 * sends an error message if message is 0 or >2000 characters long
 * sends response to the same channel the original message came from
 */
function send_response(discord_msg) {

    fs.readFile(mem_fp, 'utf8', (err, data) => {
        if (err) {
            // logs errors
            console.error('Error reading memory.json: ', err, '\n');
            return;
        };

        // sends a request to upload the contents of memory.json to the running Ollama process
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })
        .then(response => {
            // checks if the response indicates upload success
            if (!response.ok) {
                // handles errors
                throw new Error('Network response was not ok');
            };
            // gets response data
            return response.json();
        })
        .then(data => {
            // puts parsed response data content in cont variable
            let cont = data.message.content;

            // if message length is outside Discord's limits, changes message to a corresponding error message
            if (cont.length == 0 || cont.length > 2000) {
                cont = 'Error sending message. ';
                if (cont.length == 0){
                    cont += 'Cannot send empty messages.\n';
                } else {
                    cont += "Content length exceeds Discord's length limit of 2000 characters.\n";
                };
            };

            // logs message to console and sends it in the appropriate channel in Discord
            console.log(`Bot: ${cont}\n`);
            discord_msg.channel.send(`${cont}`);
        })
        .catch(error => {
            // logs any errors that occur during the fetch operation
            console.error('An error occured when recieving a response from Ollama application: ', error, '\n');
        });
    });
}

// defines an object representing the event handler for the 'MessageReady' event
module.exports = {
    name: Events.MessageCreate,
    once: false,  // specifies that this event should be executed only once
    // executes when a new message is created
    execute(message, client) {

        if (message.author.bot) {
            // does nothing if message came from a bot
        } else {
            // gets the global Discord username of the user sending the message
            const sender_name = message.author.globalName;
            // writes message content into a string variable
            const msg_str = `${message.content}`;

            // logs the message received in console
            console.log(msg_str);

            // sets the bot's activity status to 'Watching' the sender
            client.user.setActivity({
                name: `${sender_name}`,
                type: ActivityType.Watching,
            });

            // adds the new message to memory
            add_to_mem(msg_str)
                .then(() => {
                    // sends a response
                    send_response(message);
                })
                .catch(err => {
                    // logs any errors that occur during the memory addition
                    console.error('Error when adding message to memory: ', err, '\n');
                });
        }
    }
};
