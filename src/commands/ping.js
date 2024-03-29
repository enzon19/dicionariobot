'use strict';

const bot = global.bot;
const botUsername = process.env.BOT_USERNAME;

function ping (message) {
  const chatID = message.chat.id;

  bot.sendMessage(chatID, 'Pong! 🏓', {
    reply_to_message_id: message.message_id
  });
}

module.exports = { ping };