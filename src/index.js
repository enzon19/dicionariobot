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
const supabase = require('@supabase/supabase-js');
const database = supabase.createClient('https://sjsnyindtfhstuxyznot.supabase.co', process.env.SUPABASE_TOKEN);
const users = database.from('users');

// global variables
global.users = users;
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