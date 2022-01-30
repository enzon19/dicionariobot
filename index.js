// avoid warnings on console
process.env.NTBA_FIX_319 = 1;

// packages
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const requireFromString = require("require-from-string");
const Database = require("@replit/database");

// creating bot/client
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// database
const dicionarioDB = new Database();

const axios = require("axios");
const sinonimos = require('node-sinonimos');
const removeAccents = require('remove-accents-diacritics');

bot.on('message', async (message) => {

  let type = "text";
  let content;
  const commandsList = requireFromString(fs.readFileSync("./commandsList.js","utf8"));

  if (message.text || message.caption) {

    // variables

    if (message.caption) type = "caption";
    content = message[type].toString().toLowerCase();

    const command = content.split(' ')[0];
    let args = content.replace(command + " ", "");
    if (args == command) args = undefined;

    // commands system

    const variables = {"false": false, "true": true, "null": null, "bot": bot, "message": message, "content": content, "command": command, "args": args, "dicionarioDB": dicionarioDB}

    // wrong words list

    let contentList = content.split(" ");
    let list = JSON.parse(fs.readFileSync('./list.json'));
    
    for (i = 0; i < contentList.length; i++) {

      if (list[0].indexOf(removeAccents.remove(contentList[i])) != -1) bot.sendMessage(message.chat.id, (list[1][list[0].indexOf(removeAccents.remove(contentList[i]))]) + "*", { reply_to_message_id: message.message_id, disable_notification: true });

    }

    // commands

    if (content.startsWith("/")) {

      sentCommand = commandsList.filter(e => e.command == command.toLowerCase() || e.alternative.includes(command.toLowerCase()) || e.command + "@dicionariobot" == command.toLowerCase())[0];

      if (sentCommand) {
      
        const parameters = sentCommand.parameters.map(e => Object.values(variables)[Object.keys(variables).indexOf(e)]);
        const module = requireFromString(fs.readFileSync(sentCommand.modulePath, "utf8"));
        module[sentCommand.function](...parameters);

      } else if (message.chat.type == "private") {

        // shortcut on private
        let shortcut = await dicionarioDB.get("shortcut_" + message.chat.id);
        if (!shortcut) { shortcut = 0; await dicionarioDB.set("shortcut_" + message.chat.id, 0); }
     
        const shortcutVariables = {"false": false, "true": true, "null": null, "bot": bot, "message": message, "content": content, "command": command, "args": command.replace("/", "").replace("@dicionariobot", ""), "dicionarioDB": dicionarioDB}
        const shortcutCommand = commandsList.filter(e => e.command == ["/definir", "/sinonimo"][shortcut])[0];
        const parameters = shortcutCommand.parameters.map(e => Object.values(shortcutVariables)[Object.keys(shortcutVariables).indexOf(e)]);
        const module = requireFromString(fs.readFileSync(shortcutCommand.modulePath, "utf8"));
        module[shortcutCommand.function](...parameters);

      }

      if (message.chat.type == "private" && !["/start", "/privacy", "/privacidade", "/adddata", "/deletedata", "/alldata"].includes(command)) {

        const userNews = await dicionarioDB.get(message.chat.id);
        if (!userNews) dicionarioDB.set(message.chat.id, 1);

      }

    }
    
  }

  // commands using reply

  if (message.reply_to_message) {

    const replyTxt = message.reply_to_message.text;

    if (replyTxt) {

      if (replyTxt.startsWith("Respondendo essa mensagem, envia a palavra que você quer")) {

        content = message.text.toString().toLowerCase();
        const inlineVariables = {"false": false, "true": true, "null": null, "bot": bot, "message": message, "content": content, "args": content, "dicionarioDB": dicionarioDB}

        const replyCommand = commandsList.filter(e => e.command == ["/sinonimo", "/definir"][["sinônimos", "definir"].indexOf(replyTxt.match(/Respondendo essa mensagem, envia a palavra que você quer (.*?)\./)[1])])[0];
        const parameters = replyCommand.parameters.map(e => Object.values(inlineVariables)[Object.keys(inlineVariables).indexOf(e)]);
        const module = requireFromString(fs.readFileSync(replyCommand.modulePath, "utf8"));
        module[replyCommand.function](...parameters);
      
      }

    }

  }

});

bot.on('inline_query', async (inline) =>{

  const inlineCommands = requireFromString(fs.readFileSync("./commands/inline.js","utf8"));

  if (!inline.query || inline.query == " ") {

		bot.answerInlineQuery(inline.id, [], {switch_pm_text: "Escreva uma palavra para definição", switch_pm_parameter: "start", cache_time: 1});

	} else {
	
    inlineCommands.inline(bot, inline, inline.query.toLowerCase());

  }

});

bot.on("callback_query", async (callbackQuery) => {

  // settings

  if (callbackQuery.data.startsWith("shortcut_")) {

    const change = callbackQuery.data.split("_")[1];
    let news = await dicionarioDB.get(callbackQuery.message.chat.id);
    if (![0, 1].includes(news)) { news = 1; await dicionarioDB.set(callbackQuery.message.chat.id, 1); }

    dicionarioDB.set("shortcut_" + callbackQuery.message.chat.id, [1, 0][change]).then(

      bot.editMessageText(`<b>Configurações</b>\n\n• Atalho ao usar / no privado\nVocê pode escrever, por exemplo, /dicionário no chat privado para poder receber os sinônimos ou a definição. <u>Atualmente usando ${["sinônimo", "definição"][change]}</u>.\n\nPara ${["", "poder parar de"][news]} receber notícias do desenvolvimento de bots, use /${["com_interesse", "sem_interesse"][news]}.`, {chat_id: callbackQuery.message.chat.id, message_id: callbackQuery.message.message_id, parse_mode: "HTML", reply_markup: {inline_keyboard: [[{text: "Atalho para " + ["definição", "sinônimos"][change], callback_data: "shortcut_" + [1, 0][change]}]]}})

    );

  } else if (callbackQuery.data.startsWith("/")) {

    const help = requireFromString(fs.readFileSync("./commands/help.js","utf8"));
    help.help(bot, callbackQuery.message, callbackQuery.data);

  }

});

bot.on('polling_error', error => console.log(error));

require('./server')(bot, dicionarioDB);