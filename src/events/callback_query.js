'use strict';

module.exports = {
	name: 'callback_query',
  once: false,
  async execute (callback) {
    const callbackQueryIDs = callback.data.split('_');
    require(`../commands/${callbackQueryIDs[0]}`)[callbackQueryIDs[1]](callback);
  }
}