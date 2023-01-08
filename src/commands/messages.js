'use strict';

// packages
const markdownEscaper = require('../core/markdownEscaper').normal;
const fs = require('fs');

const cancelCommandData = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/commandsList.json', 'utf-8')).find(value => value.name == 'Cancelar');
const cancelCommands = [cancelCommandData.command, ...cancelCommandData.alternatives];

const bot = global.bot;

async function getUserSearchEngines(searchEngines, word, chatID) {
  if (!searchEngines) {
    const database = global.database;
    const users = database.from('users');
    const userData = (await users.select('searchEngines').eq('id', chatID)).data[0];
    searchEngines = userData.searchEngines;
  }

  const searchEnginesURLs = searchEngines.length == 0 ? 'Sem mecanismos de busca\\.' : searchEngines.map(searchEngine => `[${markdownEscaper(searchEngine.name)}](${searchEngine.url.replace('$', word)})`).join(' • ');
  return searchEnginesURLs;
}

async function sendType (message, args, typeNumber) {
  const coreFileAndFunctionName = ['define', 'synonyms', 'examples'][typeNumber];

  const typeCore = require('../core/' + coreFileAndFunctionName);
  const chatID = message.chat.id;

  bot.sendChatAction(chatID, 'typing');
  const response = await typeCore[coreFileAndFunctionName](args);
  
  if (response[0]) {
    // Se response[0] existe, então ele achou a palavra
    bot.sendMessage(chatID, response, 
      {
        parse_mode: 'MarkdownV2',
        reply_to_message_id: message.message_id,
        reply_markup: { 'remove_keyboard': true }
      }
    );
  // Erros
  } else if (response[1] == 400 && !cancelCommands.includes(args.toLowerCase().replace(`@${process.env.BOT_USERNAME}`, ''))) {
    bot.sendMessage(chatID, `Infelizmente, a palavra *"${args}"* não está cadastrada no dicionário\\.\n\nPesquisar em: ${await getUserSearchEngines(null, args, chatID)}`,
      {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
        reply_to_message_id: message.message_id,
        reply_markup: { 'remove_keyboard': true }
      }
    );
  } else if (response[1] == 503) {
    bot.sendMessage(chatID, `Eita\\. Parece que *o servidor* que serve as informações do bot \\(banco de dados do dicionário\\) *está fora do ar temporariamente*\\. Infelizmente o Dicionário Bot não administra esse banco de dados e por isso não tem controle sobre o servidor\\. Tudo que podemos fazer no momento é esperar\\.\n\nPesquisar em: ${await getUserSearchEngines(null, args, chatID)}`,
      {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
        reply_to_message_id: message.message_id,
        reply_markup: { 'remove_keyboard': true }
      }
    );
  } else if (!cancelCommands.includes(args.toLowerCase().replace(`@${process.env.BOT_USERNAME}`, ''))) {
    bot.sendMessage(chatID, `Eita\\. Houve um *erro* ao procurar por esta palavra no dicionário\\.\n\nPesquisar em: ${await getUserSearchEngines(null, args, chatID)}`,
      {
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
        reply_to_message_id: message.message_id,
        reply_markup: { 'remove_keyboard': true }
      }
    );
  }
}

async function chooseMessage (message, args, typeNumber) {
  const noArgsTerm = ['definir', 'sinônimos', 'exemplos'][typeNumber];
  const chatID = message.chat.id;

  if (!args) {
    // Se o usuário mandou apenas '/definir', então ele tem que enviar a palavra logo em seguida.
    bot.sendMessage(chatID, markdownEscaper(`Respondendo *esta mensagem*, envie a palavra que você quer ${noArgsTerm}.`),
      {
        parse_mode: 'MarkdownV2',
        reply_to_message_id: message.message_id,
        reply_markup: { 
          force_reply: true, 
          selective: true,
          input_field_placeholder: 'Envie uma palavra...'
        }
      }
    );
  } else {
    sendType(message, args, typeNumber);
  }
}

function cancel (message) {
  const chatID = message.chat.id;
  bot.sendMessage(chatID, 'Operação cancelada.', {reply_markup: { 'remove_keyboard': true }});
}

module.exports = { chooseMessage, sendType, cancel, getUserSearchEngines };