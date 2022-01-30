const fs = require('fs');
const requireFromString = require("require-from-string");
const lodash = require("lodash");

function helpMessage (bot, message) {

  let commandsList = requireFromString(fs.readFileSync("./commandsList.js","utf8"));
  commandsList = commandsList.filter(command => !command.admin);

  let arrAll = [];

  for (let i = 0; i < commandsList.length; i++) {

    arrAll.push({"text": commandsList[i].name, "callback_data": commandsList[i].command});

  }

  const btns = lodash.chunk(arrAll, 2);
  bot.sendMessage(message.chat.id, "Clique em um dos botões abaixo para obter mais informações.", { reply_to_message_id: message.message_id, reply_markup: {inline_keyboard: btns }})

}

function help (bot, message, commandClicked) {

  const commandsList = requireFromString(fs.readFileSync("./commandsList.js","utf8"));
  const command = commandsList.find(e => e.command == commandClicked);

  let others = "";
  if (command.alternative.length > 0) others = `\n<b>Alternativas:</b> ${command.alternative.join(", ")}`;
  if (command.example) others += `\n<b>Exemplo:</b> <code>${command.example}</code>`;

  bot.editMessageText(`<b>Nome:</b> ${command.name}\n<b>Descrição:</b> ${command.description}\n<b>Comando:</b> ${command.command}${others}`, {chat_id: message.chat.id, message_id: message.message_id, parse_mode: "HTML", reply_markup: message.reply_markup});

}

module.exports = {helpMessage, help}