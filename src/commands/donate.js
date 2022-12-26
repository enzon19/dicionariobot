'use strict';

const bot = global.bot;

function donate (message) {
  const chatID = message.chat.id;
  const donateText = `Se você gosta do bot e apoia o desenvolvimento dele, me ajude realizando uma doação\\!\n\n*Pix:* enzonbarata@outlook\\.com\n[Outros métodos\\.\\.\\.](https://enzon19.com/#donate)`;

  bot.sendMessage(chatID, donateText, {
    parse_mode: "MarkdownV2",
    reply_to_message_id: message.message_id,
    disable_web_page_preview: true
  });
}

module.exports = { donate }