'use strict';

module.exports = {
	name: 'new_chat_members',
  once: false,
  async execute (message) {
    if (message.new_chat_members.find(member => member.username == process.env.BOT_USERNAME)) require('../commands/about').start(message);
  }
}