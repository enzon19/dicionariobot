'use strict';

// avoid warnings on console
process.env.NTBA_FIX_319 = 1;

// packages
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// creating bot/client
require('dotenv').config()
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// database
const { getXataClient } = require("./xata");
const xata = getXataClient();

// global variables
global.xata = xata;
global.bot = bot;

// events
require('./core/events').deployEvents();

// error
const logError = require('./core/error');

process.on('unhandledRejection', (reason, promise) => logError(reason, promise));
process.on('uncaughtException', (reason, origin) => logError(reason, origin));
bot.on('polling_error', error => logError(error));

// server
require('./server')();