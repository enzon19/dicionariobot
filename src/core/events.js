'use strict';

const fs = require('fs');
const bot = global.bot;

async function deployEvents() {
	const eventFiles = fs.readdirSync(__dirname + '/../events').filter(event => event.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    if (event.once) {
      bot.once(event.name, (...args) => event.execute(...args));
    } else {
      bot.on(event.name, (...args) => event.execute(...args));
    }
  }
}

module.exports = {deployEvents};