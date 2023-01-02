"use strict";

const bot = global.bot;
const database = global.database;

const moment = require('moment');
const getUserSearchEngines = require('../commands/messages.js').getUserSearchEngines;
const cancel = require('../commands/messages.js').cancel;

// MAIN MENU

async function mainMenu(chatID) {
  const users = database.from('users');
  const userData = (await users.select('shortcut,searchEngines').eq('id', chatID)).data[0];

  if (userData) {
    const shortcut = userData.shortcut;
    const shortcutLabel = ['Definição', 'Sinônimos', 'Exemplos'][shortcut];
 
    const searchEngines = userData.searchEngines;
    const searchEnginesLabel = await getUserSearchEngines(searchEngines, "");

    return {
      text: `__*CONFIGURAÇÕES*__\n\n*Atalho:* ${shortcutLabel}\n*Mecanismos de busca:* ${searchEnginesLabel}`, 
      options: {
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "Atalho", callback_data: 'settings_shortcutMenu' }],
            [{ text: "Mecanismos de busca", callback_data: 'settings_searchEngineMenu' }],
            [{ text: "Dados armazenados", callback_data: 'settings_dataStoredMenu' }]
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

async function cancelAndBackToMainMenu (callback) {
  cancel(callback.message);
  backToMainMenu(callback);
}

// SHORTCUTS

async function shortcutMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  const chatType = message.chat.type;

  const users = database.from('users');
  const userData = (await users.select('shortcut').eq('id', chatID)).data[0];

  const shortcut = userData.shortcut;
  const shortcutLabel = ['Definição', 'Sinônimos', 'Exemplos'][shortcut];

  let buttons = ([
    { text: "Definição", callback_data: 'settings_setShortcut_0' }, 
    { text: "Sinônimos", callback_data: 'settings_setShortcut_1' }, 
    { text: "Exemplos", callback_data: 'settings_setShortcut_2' }
  ]);
  buttons.splice(shortcut, 1);

  bot.editMessageText(`__*CONFIGURAÇÕES \\> ATALHO*__\n\n*Atalho atual:* ${shortcutLabel}\n${chatType == 'private' ? 'Escolha abaixo qual será seu atalho\\.' : 'Atalhos não funcionam em grupos\\.'} Saiba mais no comando /ajuda\\.`, {
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
  
  shortcutMenu(callback);
}

// SEARCH ENGINE

async function searchEngineMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  
  bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA*__\n\n*Mecanismos atuais:* ${await getUserSearchEngines(null, "", chatID)}\nGerencie abaixo seus mecanismos de busca\\. Saiba mais no comando /ajuda\\.`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Adicionar", callback_data: 'settings_addSearchEngineMenu' }, { text: "Remover", callback_data: 'settings_removeSearchEngineMenu' }],
        [{ text: "Restaurar para mecanismos de busca padrão", callback_data: 'settings_defaultSearchEnginesMenu' }],
        [{ text: "⬅️ Voltar", callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

async function addSearchEngineMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const users = database.from('users');
  const userData = (await users.select('searchEngines').eq('id', chatID)).data[0];
  const searchEngines = userData.searchEngines;

  if (searchEngines.length < 10) {
    bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA \\> ADICIONAR*__\n\nEnvie o nome e o link colocando um \`$\` onde deve entrar a palavra\\, desse jeito: \`Exemplo - https://exemplo.com/pesquisa?q=$\` \\(o formato do URL varia de site para site\\)\\. Saiba mais no comando /ajuda\\.`, {
      parse_mode: "MarkdownV2",
      chat_id: chatID,
      message_id: message.message_id,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '❌ Cancelar', callback_data: 'settings_cancelAndBackToMainMenu' }],
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });

    bot.sendMessage(chatID, 'Respondendo *esta mensagem*, envie o nome e o link seguindo as instruções anteriores\\.', {
      parse_mode: "MarkdownV2",
      reply_markup: {
        input_field_placeholder: 'Exemplo - https://exemplo.com/pesquisa?q=$',
        force_reply: true, 
        selective: true
      }
    });
  } else {
    bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA \\> ADICIONAR*__\n\nVocê já *atingiu o limite* de 10 mecanismos de busca\\.`, {
      parse_mode: "MarkdownV2",
      chat_id: chatID,
      message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });
  }
}

async function addSearchEngine (message) {
  const chatID = message.chat.id;

  const users = database.from('users');
  const userData = (await users.select().eq('id', chatID)).data[0];
  let searchEngines = userData.searchEngines;
  const messageParsed = message.text.match(/(.*) - (.*)/);

  if (searchEngines.length < 10 && messageParsed) {
    const searchEngineName = messageParsed[1].substring(0, 35);
    let searchEngineURL = messageParsed[2].substring(0, 80);
    if (!searchEngineURL.includes('$')) searchEngineURL += '$';
    
    searchEngines.push({"name": searchEngineName, "url": searchEngineURL});

    users.update({ 'searchEngines': searchEngines }).eq('id', chatID).then(e => {
      bot.sendMessage(chatID, `*Pronto\\!* Mecanismo adicionado\\.`, {
        parse_mode: "MarkdownV2",
        reply_markup: {
          remove_keyboard: true
        }
      });
    });
  } else if (!messageParsed) {
    bot.sendMessage(chatID, `Você *não formatou* corretamente\\.`, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Tentar de novo", callback_data: 'settings_addSearchEngineMenu' }],
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });
  } else {
    bot.sendMessage(chatID, 'Você já *atingiu o limite* de 10 mecanismos de busca\\.', {
      parse_mode: "MarkdownV2",
      reply_markup: {
        remove_keyboard: true
      }
    });
  }
}

async function removeSearchEngineMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const users = database.from('users');
  const userData = (await users.select('searchEngines').eq('id', chatID)).data[0];
  const searchEngines = userData.searchEngines;

  if (searchEngines.length > 0) {
    bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA \\> REMOVER*__\n\nEscolha um dos mecanismos para remover respondendo a mensagem abaixo\\. Saiba mais no comando /ajuda\\.`, {
      parse_mode: "MarkdownV2",
      chat_id: chatID,
      message_id: message.message_id,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: '❌ Cancelar', callback_data: 'settings_cancelAndBackToMainMenu' }],
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });

    const optionsToRemove = searchEngines.map(searchEngine => [{ text: `${searchEngine.name} - ${searchEngine.url}` }]);

    bot.sendMessage(chatID, 'Respondendo *esta mensagem*, clique em um dos mecanismos para remover\\.', {
      parse_mode: "MarkdownV2",
      reply_markup: {
        input_field_placeholder: 'Exemplo - https://exemplo.com/pesquisa?q=$',
        force_reply: true,
        selective: true,
        keyboard: optionsToRemove,
        resize_keyboard: true
      }
    });
  } else {
    bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA \\> REMOVER*__\n\nVocê *não tem* mecanismos de busca\\.`, {
      parse_mode: "MarkdownV2",
      chat_id: chatID,
      message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });
  }
}

async function removeSearchEngine (message) {
  const chatID = message.chat.id;

  const users = database.from('users');
  const userData = (await users.select().eq('id', chatID)).data[0];
  let searchEngines = userData.searchEngines;
  const messageParsed = message.text.match(/(.*) - (.*)/);

  if (searchEngines.length > 0 && messageParsed) {
    const searchEngineName = messageParsed[1].substring(0, 35);
    let searchEngineURL = messageParsed[2].substring(0, 80);
    const selectedEngineIndex = searchEngines.findIndex(searchEngine => searchEngine.name == searchEngineName & searchEngine.url == searchEngineURL);

    if (selectedEngineIndex >= 0) {
      searchEngines.splice(selectedEngineIndex, 1);

      users.update({ 'searchEngines': searchEngines }).eq('id', chatID).then(e => {
        bot.sendMessage(chatID, `*Pronto\\!* Mecanismo removido\\.`, {
          parse_mode: "MarkdownV2",
          reply_markup: {
            remove_keyboard: true
          }
        });
      });
    } else {
      bot.sendMessage(chatID, `Esse mecanismo de busca *não está cadastrado*\\.`, {
        parse_mode: "MarkdownV2",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Tentar de novo", callback_data: 'settings_removeSearchEngineMenu' }],
            [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
          ]
        }
      });
    }
  } else if (!messageParsed) {
    bot.sendMessage(chatID, `Você *não formatou* corretamente\\.`, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Tentar de novo", callback_data: 'settings_removeSearchEngineMenu' }],
          [{ text: "⬅️ Voltar", callback_data: 'settings_searchEngineMenu' }]
        ]
      }
    });
  } else {
    bot.sendMessage(chatID, 'Você *não tem* mecanismos de busca\\.', {
      parse_mode: "MarkdownV2",
      reply_markup: {
        remove_keyboard: true
      }
    });
  }
}

async function defaultSearchEnginesMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  bot.editMessageText(`__*CONFIGURAÇÕES \\> MECANISMOS DE BUSCA \\> RESTAURAR*__\n\nTem certeza de que deseja restaurar para mecanismos de busca padrão?`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Não", callback_data: 'settings_searchEngineMenu' }, { text: "Sim", callback_data: 'settings_setDefaultSearchEngines' }],
        [{ text: '❌ Cancelar', callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

function setDefaultSearchEngines (callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  
  const users = database.from('users');
  const defaultSearchEngines = [{
    "name": "Google",
    "url": "https://www.google.com/search?q=$"
  },
  {
    "name": "Bing",
    "url": "https://www.bing.com/search?q=$"
  },
  {
    "name": "DuckDuckGo",
    "url": "https://www.duckduckgo.com/search?q=$"
  },
  {
    "name": "Dicionário Informal",
    "url": "https://www.dicionarioinformal.com.br/$"
  },
  {
    "name": "Wikipédia",
    "url": "https://pt.wikipedia.org/wiki/Special:Search?search=$"
  }];

  users.update({ 'searchEngines': defaultSearchEngines }).eq('id', chatID).then(e => {
    bot.sendMessage(chatID, `*Pronto\\!* Mecanismos de busca restaurados para o padrão\\.`, {
      parse_mode: "MarkdownV2",
      reply_markup: {
        remove_keyboard: true
      }
    });
  });
}

// STORED DATA

async function dataStoredMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;
  
  const users = database.from('users');
  const userData = (await users.select().eq('id', chatID)).data[0];

  const dataText = `*ID do chat do Telegram:* ${userData.id}
*Tipo de chat do Telegram:* ${userData.type}
*Atalho:* ${['Definição', 'Sinônimos', 'Exemplos'][userData.shortcut]}
*Mecanismos de busca:* ${await getUserSearchEngines(userData.searchEngines, "")}
*Data do cadastro no bot:* ${moment(userData.createdAt).format('DD/MM/YYYY HH:mm:ss')}
*Data do último uso do bot:* ${moment(userData.lastUseAt).format('DD/MM/YYYY HH:mm:ss')}`

  bot.editMessageText(`__*CONFIGURAÇÕES \\> DADOS*__\n\n${dataText}`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Apagar dados", callback_data: 'settings_deleteDataMenu' }],
        [{ text: "⬅️ Voltar", callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

async function deleteDataMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  bot.editMessageText(`__*CONFIGURAÇÕES \\> DADOS \\> APAGAR*__\n\nTem certeza de que deseja apagar seus dados?`, {
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "Não", callback_data: 'settings_dataStoredMenu' }, { text: "Sim", callback_data: 'settings_deleteData' }],
        [{ text: '❌ Cancelar', callback_data: 'settings_backToMainMenu' }]
      ]
    }
  });
}

async function deleteData (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  database.from('users')
    .delete()
    .eq('id', chatID).then(() => bot.editMessageText('*Seus dados foram apagados\\!* Se você enviar uma nova mensagem para o bot seu cadastro será feito novamente\\.', {parse_mode: 'MarkdownV2', chat_id: chatID, message_id: message.message_id}));
}

module.exports = { 
  settingsMainMenu, backToMainMenu, cancelAndBackToMainMenu, 
  shortcutMenu, setShortcut, 
  searchEngineMenu, addSearchEngineMenu, addSearchEngine, removeSearchEngineMenu, removeSearchEngine, defaultSearchEnginesMenu, setDefaultSearchEngines,
  dataStoredMenu, deleteDataMenu, deleteData 
};