'use strict';

module.exports = {
	name: 'group_chat_created',
  once: false,
  async execute (message) {
    require('../commands/about').start(message);
  }
}