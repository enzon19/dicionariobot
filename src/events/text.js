'use strict';

module.exports = {
	name: 'text',
  once: false,
  async execute (message) {
    const commandsHandler = require('../core/handler');

    // any message
    if (message.text) {
      commandsHandler.parseMessageAndSaveUser(message);
    }
  
    // commands using reply
    if (message.reply_to_message?.text && message.reply_to_message?.from?.username == process.env.BOT_USERNAME) {
      commandsHandler.parseReply(message);
    }
  }
}