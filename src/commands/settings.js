"use strict";

const bot = global.bot;
const database = global.database;

const moment = require('moment');

// MAIN MENU

async function mainMenu(chatID) {
  const users = database.from('users');
  const userData = (await users.select('shortcut,searchEngines').eq('id', chatID)).data[0];

  if (userData) {
    const shortcut = userData.shortcut;
    const shortcutLabel = ['Definição', 'Sinônimos', 'Exemplos'][shortcut];

    const searchEngines = userData.searchEngines;
    const searchEnginesLabel = searchEngines.map(searchEngine => `[${searchEngine.name}](${searchEngine.url})`).join(', ');

    return {
      text: `__*CONFIGURAÇÕES*__\n\n*Atalho:* ${shortcutLabel}\n*Mecanismos de busca:* ${searchEnginesLabel}`, 
      options: {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Atalho", callback_data: 'settings_shortcut' }],
            [{ text: "Mecanismos de busca", callback_data: 'settings_searchEngine' }],
            [{ text: "Dados armazenados", callback_data: 'settings_dataStored' }]
          ]
        }
      }
    }
  } else {
    return undefined;
  }
}

async function settingsMainMenu (message) {
  const chatID = message.chat.id;

  const mainMenuData = await mainMenu(chatID);
  if (mainMenuData) {
    mainMenuData.options.reply_to_message_id = message.message_id;
    bot.sendMessage(chatID, mainMenuData.text, mainMenuData.options);
  }
}

async function backToMainMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const mainMenuData = await mainMenu(chatID);
  mainMenuData.options.message_id = message.message_id;
  mainMenuData.options.chat_id = chatID;

  bot.editMessageText(mainMenuData.text, mainMenuData.options);
}

// SHORTCUTS

async function shortcut(callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const users = database.from('users');
  const userData = (await users.select('shortcut').eq('id', chatID)).data[0];

  const shortcut = userData.shortcut;
  const shortcutLabel = ['Definição', 'Sinônimos', 'Exemplos'][shortcut];

  const buttons = ([
    { text: "Definição", callback_data: 'settings_setShortcut_0' }, 
    { text: "Sinônimos", callback_data: 'settings_setShortcut_1' }, 
    { text: "Exemplos", callback_data: 'settings_setShortcut_2' }
  ]).filter(button => button.text != shortcutLabel);

  bot.editMessageText(`__*CONFIGURAÇÕES \\> ATALHO*__\n\n*Atalho atual:* ${shortcutLabel}\nEscolha abaixo qual será seu atalho\\. Saiba mais no comando /ajuda\\.`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    reply_markup: {
      inline_keyboard: [
        buttons,
        [{ text: "⬅️ Voltar", callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

async function setShortcut (callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  const type = callback.data.slice(-1);

  await database.from('users')
    .update({ shortcut: type })
    .eq('id', chatID);
  
  shortcut(callback);
}

// SEARCH ENGINE

// STORED DATA

async function dataStored(callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  
  const users = database.from('users');
  const userData = (await users.select().eq('id', chatID)).data[0];

  const dataText = `*ID do chat do Telegram:* ${userData.id}
*Tipo de chat do Telegram:* ${userData.type}
*Atalho:* ${['Definição', 'Sinônimos', 'Exemplos'][userData.shortcut]}
*Mecanismos de busca:* ${userData.searchEngines.map(searchEngine => `[${searchEngine.name}](${searchEngine.url})`).join(', ')}
*Data de criação no bot:* ${moment(userData.createdAt).format('DD/MM/YYYY HH:mm:ss')}
*Data do último uso do bot:* ${moment(userData.lastUseAt).format('DD/MM/YYYY HH:mm:ss')}`

  bot.editMessageText(`__*CONFIGURAÇÕES \\> DADOS*__\n\n${dataText}`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Apagar dados", callback_data: 'settings_deleteData' }],
        [{ text: "⬅️ Voltar", callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

async function deleteData (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  database.from('users')
    .delete()
    .eq('id', chatID).then(() => bot.editMessageText('*Seus dados foram deletados!* Se você enviar uma nova mensagem para o bot seu cadastro será feito novamente.', {parse_mode: 'Markdown', chat_id: chatID, message_id: message.message_id}));
}

module.exports = { settingsMainMenu, backToMainMenu, shortcut, setShortcut, dataStored, deleteData };