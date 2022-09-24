"use strict";

// packages
const fs = require('fs');
const requireFromString = require('require-from-string');

const bot = global.bot;
const corePath = './src/commands/core';

async function chooseMessage (message, args, typeNumber) {
  const coreFileAndFunctionName = ['define', 'synonyms', 'examples'][typeNumber];
  const noArgsText = ['definir', 'sinônimos', 'exemplos'][typeNumber];

  const typeCore = requireFromString(fs.readFileSync(`${corePath}/${coreFileAndFunctionName}.js`, 'utf-8'));
  const chatID = message.chat.id;

  if (!args) {
    // Se o usuário mandou apenas '/definir', então ele tem que enviar a palavra logo em seguida.
    bot.sendMessage(chatID, `Respondendo *esta mensagem*, envie a palavra que você quer ${noArgsText}.`,
      {
        parse_mode: "Markdown",
        reply_to_message_id: message.message_id,
        disable_notification: true,
        reply_markup: { 
          force_reply: true, 
          selective: true 
        }
      }
    );
  } else {
    bot.sendChatAction(chatID, "typing");
    const response = await typeCore[coreFileAndFunctionName](args);

    if (response[0]) {
      // Se response[0] existe, então ele achou a palavra
      bot.sendMessage(chatID, response, 
        {
        parse_mode: "Markdown",
        reply_to_message_id: message.message_id,
        disable_notification: true
        }
      );
    // REVISITAR --- PRECISA ADICIONAR MOTOR DE BUSCA NAS OPÇÕES ABAIXO. Erros
    } else if (response[1] == 400) {
      bot.sendMessage(chatID, `Infelizmente, a palavra *"${args}"* não está cadastrada no dicionário.`,
        {
          parse_mode: "Markdown",
          reply_to_message_id: message.message_id,
          disable_notification: true
        }
      );
    } else if (response[1] == 503) {
      bot.sendMessage(chatID, `Eita. Parece que *o servidor* que serve as informações do bot (banco de dados do dicionário) *está fora do ar temporariamente*. Infelizmente o Dicionário Bot não administra esse banco de dados e por isso não tem controle sobre o servidor. Tudo que podemos fazer no momento é esperar.`,
        {
          parse_mode: "Markdown",
          reply_to_message_id: message.message_id,
          disable_notification: true
        }
      );
    } else {
      bot.sendMessage(chatID, `Eita. Houve um *erro* ao procurar por esta palavra no dicionário.`,
        {
          parse_mode: "Markdown",
          reply_to_message_id: message.message_id,
          disable_notification: true
        }
      );
    }
  }
}

module.exports = { chooseMessage };