'use strict';

// packages
const fs = require('fs');
const moment = require('moment-timezone');

const users = global.users;
const botUsername = process.env.BOT_USERNAME;
const bot = global.bot;
const database = global.database;
const mistakesList = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/mistakes.json'));

async function parseMessageAndSaveUser (message) {
  const messageText = message.text?.toLowerCase() || message.caption?.toLowerCase();
  const chatType = message.chat.type;
  let commandReturned;
  
  // check if there's command on the text
  if (messageText.startsWith('/')) {
    const command = messageText.split(' ')[0].replace('@' + botUsername, ''); 
    const args = messageText.split(' ')[1];

    commandReturned = findCommand(command, args, chatType, message);
  } else if (chatType == 'private' && !message.reply_to_message) {
    userShortcut(message);
  } else if (chatType != 'private' && message.reply_to_message?.from?.username != botUsername) {
    checkMistakes(messageText, message);
  }

  // update or add user data. Only allowed if the command have the saveUserData == true or it's a shortcut or mistake check (command inexistent)
  if (commandReturned == undefined || commandReturned.saveUserData) {
    const nowFormatted = moment();

    await users.upsert({
      id: message.chat.id,
      type: chatType,
      lastUseAt: nowFormatted
    });
  }
}

function findCommand (command, args, chatType, message) {
  // get all commands
  const commandsList = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/commandsList.json', 'utf-8'));

  // all possible variables
  const variablesNamesWithValues = {
    'message': message, 
    'args': args
  };

  // get the command used in the user message
  const commandUsed = commandsList.find(value => value.command == command || value.alternatives.includes(command));

  // check if commandUsed exists
  if (commandUsed) {
    // get all elements in parameters array that are in the JSON, and replace with the values of 'variablesNamesWithValues'
    const parameters = commandUsed.parameters.map(value => typeof value == 'number' || typeof value == 'boolean' ? value : variablesNamesWithValues[value]);
    // use function that are in the JSON and pass the parameters
    const module = require('../commands/' + commandUsed.modulePath);
    module[commandUsed.function](...parameters);
    return commandUsed;
  } else {
    // if it's private, then it's a shortcut. If it's a group, then do nothing
    if (chatType == 'private') userShortcut(message);
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
  } else if (replyMessageText == 'Respondendo esta mensagem, envie o nome e o link seguindo as instruções anteriores.') {
    require('../commands/settings').addSearchEngine(message);
  } else if (replyMessageText == 'Respondendo esta mensagem, clique em um dos mecanismos para remover.') {
    require('../commands/settings').removeSearchEngine(message);
  }
}

async function userShortcut (message) {
  const chatID = message.chat.id;

  const messageText = message.text?.toLowerCase() || message.caption?.toLowerCase();
  const word = messageText[0] == '/' ? messageText.slice(1).split(' ')[0] : messageText.split(' ')[0];

  const users = database.from('users');
  const userData = (await users.select('shortcut').eq('id', chatID)).data[0];

  require('../commands/messages').sendType(message, word, userData.shortcut);
}

function checkMistakes (text, message) {
  const chatID = message.chat.id;

  const checkMistakes = require('./checkMistakes');
  const mistakesMessage = checkMistakes.check(checkMistakes.removePunctuation(text), mistakesList);

  if (mistakesMessage) bot.sendMessage(chatID, mistakesMessage, { reply_to_message_id: message.message_id });
}

module.exports = {parseMessageAndSaveUser, parseReply};