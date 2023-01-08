'use strict';

module.exports = {
	name: 'inline_query',
  once: false,
  async execute (inline) {
    require('../commands/inline').parseInlineAndSaveUser(inline);
  }
}