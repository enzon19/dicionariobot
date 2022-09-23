'use strict';

// avoid warnings on console
process.env.NTBA_FIX_319 = 1;

// packages
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const requireFromString = require('require-from-string');

// creating bot/client
require('dotenv').config()
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// database
const supabase = require('@supabase/supabase-js');
const database = supabase.createClient('https://sjsnyindtfhstuxyznot.supabase.co', process.env.SUPABASE_TOKEN);
const users = database.from('users');

// global variables
global.users = users;
global.bot = bot;

// folders path
const commandsPath = './src/commands';
const corePath = './src/commands/core';

// command handler
bot.on('message', async (message) => {
  // any message
  if (message.text || message.caption) {
    const commandsHandler = requireFromString(fs.readFileSync(corePath + '/handler.js', 'utf-8'));
    commandsHandler.parseMessageAndSaveUser(message);
  }

  // commands using reply
  if (message.reply_to_message?.text) {
    //
  }
});

// error
const logError = require('../commands/core/error.js');

process.on('unhandledRejection', (reason, promise) => logError(reason, promise));
process.on('uncaughtException', (reason, origin) => logError(reason, origin));
bot.on('polling_error', error => logError(error));

// server
require('./server')(bot);