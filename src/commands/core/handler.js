'use strict';

// packages
const fs = require('fs');
const requireFromString = require('require-from-string');

const users = global.users;
const botUsername = process.env.BOT_USERNAME;
const bot = global.bot;

async function parseMessageAndSaveUser (message) {
  const messageText = message.text?.toLowerCase() || message.caption?.toLowerCase();
  const chatType = message.chat.type;
  let commandReturned;

  // current date and time for lastUseAt column
  const nowFormatted = (new Date()).toISOString();
  
  // check if there's command on the text
  if (messageText.startsWith('/')) {
    const command = messageText.split(' ')[0].replace('@' + botUsername, ''); 
    const args = messageText.split(' ')[1];

    commandReturned = findCommand(command, args, chatType, message);
  } else if (chatType == 'private' && !message.reply_to_message) {
    userShortcut();
  } else if (chatType != 'private' && message.reply_to_message?.from?.username != botUsername) {
    checkGrammar();
  }

  // update or add user data. Only allowed if the command have the saveUserData == true or it's a shortcut (command inexistent)
  if (commandReturned == undefined || commandReturned.saveUserData) {
    await users.upsert({
      id: message.chat.id,
      type: chatType,
      lastUseAt: nowFormatted
    });
  }
}

function findCommand (command, args, chatType, message) {
  // get all commands
  const commandsList = JSON.parse(fs.readFileSync('./src/assets/json/commandsList.json', 'utf-8'));

  // all possible variables
  const variablesNamesWithValues = {
    "message": message, 
    "args": args
  };

  // get the command used in the user message
  const commandUsed = commandsList.find(value => value.command == command || value.alternatives.includes(command));

  // check if commandUsed exists
  if (commandUsed) {
    // get all elements in parameters array that are in the JSON, and replace with the values of 'variablesNamesWithValues'
    const parameters = commandUsed.parameters.map(value => typeof value == 'number' || typeof value == 'boolean' ? value : variablesNamesWithValues[value]);
    // use function that are in the JSON and pass the parameters
    const module = requireFromString(fs.readFileSync('./src/commands' + commandUsed.modulePath, "utf8"));
    module[commandUsed.function](...parameters);
    return commandUsed;
  } else {
    // if it's private, then it's a shortcut. If it's a group, then do nothing
    if (chatType == 'private') userShortcut();
    return undefined;
  }
}

function parseReply (message) {
  // message
  const messageText = message.text?.toLowerCase() || message.caption?.toLowerCase();

  // reply
  const replyMessage = message.reply_to_message;
  const replyMessageText = replyMessage.text;
  const command = replyMessageText.match(/Respondendo esta mensagem, envie a palavra que você quer (.*?)\./);

  if (command) {
    const newMessageText = `/${command[1]} ${messageText}`;
    message.text = newMessageText;
    parseMessageAndSaveUser(message);
  }
}

function userShortcut () {
  console.log('atalho')
}

function checkGrammar () {
  console.log('ver se tem erros gramáticos')
}

module.exports = {parseMessageAndSaveUser, parseReply};