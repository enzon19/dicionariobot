'use strict';

const bot = global.bot;
const fs = require('fs');
const lodash = require("lodash");
const markdownEscaper = require('../core/markdownEscaper').normal;

// MAIN MENU

function mainMenu() {
  return {
    text: `__*AJUDA*__\n\nConheça todos os comandos ou veja o FAQ \\(perguntas frequentes\\)\\.`, 
    options: {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Comandos", callback_data: 'help_commandsMenu' }],
          [{ text: "FAQ", callback_data: 'help_faqMenu' }]
        ]
      }
    }
  };
}

function helpMainMenu (message) {
  const chatID = message.chat.id;

  let mainMenuData = mainMenu();
  mainMenuData.options.reply_to_message_id = message.message_id;
  bot.sendMessage(chatID, mainMenuData.text, mainMenuData.options);
}

function backToMainMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  let mainMenuData = mainMenu(chatID);
  mainMenuData.options.message_id = message.message_id;
  mainMenuData.options.chat_id = chatID;

  bot.editMessageText(mainMenuData.text, mainMenuData.options);
}

// COMMANDS

function commandsMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const commandsList = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/commandsList.json'));
  const commandsAsButtons = commandsList.map(command => ({"text": command.name, "callback_data": `help_aboutCommand_${command.command}`}));

  const twoColumnsButtons = lodash.chunk(commandsAsButtons, 2);
  bot.editMessageText(`__*AJUDA \\> COMANDOS*__\n\nTodos os *${commandsList.length} comandos* estão listados aqui\\. *Clique* em um deles para saber mais\\.`, { 
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    reply_to_message_id: message.message_id, 
    reply_markup: {
      inline_keyboard: [...twoColumnsButtons, [{ text: "⬅️ Voltar", callback_data: 'help_backToMainMenu' }]]
    }
  });
}

function aboutCommand (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const commandsList = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/commandsList.json'));
  const commandClicked = commandsList.find(command => command.command == callback.data.split('_')[2]);

  const aboutCommandText = `*Nome:* ${commandClicked.name}
*Descrição:* ${commandClicked.description}
*Comando:* ${commandClicked.command}
${commandClicked.alternatives.length > 0 ? `*Alternativas:* ${commandClicked.alternatives.join(", ")}` : ''}
${commandClicked.example ? `*Exemplo:* \`${commandClicked.example}\`` : ''}
`

  bot.editMessageText('__*AJUDA \\> COMANDOS \\> SOBRE*__\n\n' + aboutCommandText, { 
    parse_mode: "Markdown",
    chat_id: chatID,
    message_id: message.message_id,
    reply_to_message_id: message.message_id, 
    reply_markup: {
      inline_keyboard: [[{ text: '❌ Cancelar', callback_data: 'help_backToMainMenu' }], [{ text: "⬅️ Voltar", callback_data: 'help_commandsMenu' }]]
    }
  });
}

// FAQ

function faqMenu (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const categories = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/help.json'));
  const categoriesAsButtons = categories.map((category, index) => ({"text": category.categoryName, "callback_data": `help_faqViewCategory_${index}`}));

  const twoColumnsButtons = lodash.chunk(categoriesAsButtons, 2);
  bot.editMessageText(`__*AJUDA \\> FAQ*__\n\nEssas são algumas *categorias*\\. *Clique* em uma para ver as perguntas\\.`, { 
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    reply_to_message_id: message.message_id, 
    reply_markup: {
      inline_keyboard: [...twoColumnsButtons, [{ text: "⬅️ Voltar", callback_data: 'help_backToMainMenu' }]]
    }
  });
}

function faqViewCategory (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const categories = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/help.json'));
  const category = categories[callback.data.slice(-1)];
  const questions = category.questions;
  const questionsAsButtons = questions.map((question, index) => [{"text": question.question, "callback_data": `help_faqViewQuestion_${callback.data.slice(-1)}_${index}`}]);

  bot.editMessageText(`__*AJUDA \\> FAQ \\> ${markdownEscaper(category.categoryName.toUpperCase())}*__\n\nEssas são as *perguntas dessa categoria*\\. *Clique* em uma para ver a resposta\\.`, { 
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    reply_to_message_id: message.message_id, 
    reply_markup: {
      inline_keyboard: [...questionsAsButtons, [{ text: '❌ Cancelar', callback_data: 'help_backToMainMenu' }], [{ text: "⬅️ Voltar", callback_data: 'help_faqMenu' }]]
    }
  });
}

function faqViewQuestion (callback) {
  const message = callback.message;
  const chatID = message.chat.id;

  const indexes = callback.data.split('_');
  const categoryIndex = indexes[2];
  const questionIndex = indexes[3];

  const categories = JSON.parse(fs.readFileSync(__dirname + '/../assets/json/help.json'));
  const category = categories[categoryIndex];
  const question = category.questions[questionIndex];
  bot.editMessageText(`__*AJUDA \\> FAQ \\> ${markdownEscaper(category.categoryName.toUpperCase())} \\> PERGUNTA ${Number(questionIndex) + 1}*__\n\n*${markdownEscaper(question.question)}*\n${markdownEscaper(question.answer, null, /\\(`)/g)}`, { 
    parse_mode: "MarkdownV2",
    chat_id: chatID,
    message_id: message.message_id,
    reply_to_message_id: message.message_id, 
    reply_markup: {
      inline_keyboard: [[{ text: '❌ Cancelar', callback_data: 'help_backToMainMenu' }], [{ text: "⬅️ Voltar", callback_data: `help_faqViewCategory_${categoryIndex}` }]]
    }
  });
}

module.exports = { 
  helpMainMenu, backToMainMenu,
  commandsMenu, aboutCommand,
  faqMenu, faqViewCategory, faqViewQuestion
};