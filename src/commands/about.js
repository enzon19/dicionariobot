'use strict';

const markdownEscaper = require('../core/markdownEscaper');

const bot = global.bot;
const botUsername = process.env.BOT_USERNAME;

function start (message) {
  const chatID = message.chat.id;
  const aboutText = `*Dicionário Bot \\(dicionariobot\\)*
Um dicionário da língua portuguesa brasileira no Telegram\\. 

Para começar envie /definir, /sinonimos ou /exemplos\\. Você também pode usar o modo inline ao digitar @${botUsername} no campo de mensagem em qualquer bate\\-papo e escrever alguma palavra\\. Quando adicionado em algum grupo, pode corrigir alguns erros gramaticais\\.

_Você pode ler a [política de privacidade informal](https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16)\\, além de [ver o código\\-fonte do bot](https://github.com/enzon19/dicionariobot)\\._`;

  //console.log(markdownEscaper(aboutText))
  bot.sendMessage(chatID, aboutText, {
    parse_mode: "MarkdownV2",
    reply_to_message_id: message.message_id,
    disable_notification: true, disable_web_page_preview: true, 
    reply_markup: {
      inline_keyboard: 
      [[{text: "Usar modo inline", switch_inline_query: ""}]]
    }
  });
}


module.exports = {start} //, groupAdd, about