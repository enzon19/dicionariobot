function ping (bot, message) {

  bot.sendMessage(message.chat.id, `Pong! 🏓`, {reply_to_message_id: message.message_id, disable_notification: true});

}

function start (bot, message) { 

  bot.sendMessage(message.chat.id, '<b>Dicionário Bot (dicionariobot)</b>\n\nO Dicionário Bot funciona normalmente ou através do modo inline, ou seja, ao escrever @dicionariobot e pesquisar por uma palavra ou escrever uma frase. Ele também funciona no privado usando <code>/definir</code> ou <code>/sinonimo</code>. Ao escrever uma palavra, retorna a definição (ou os sinônimos). Se você cometer um erro, o bot talvez te corrija ou corrija outros membros de um grupo. <a href="https://github.com/enzon19/dicionariobot">Qualquer pessoa pode usar o bot, ver o código principal e criar códigos baseados</a>.\n\n<i>O desenvolvedor deste bot leva a privacidade a sério, por isso você pode checar a <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16">política de privacidade informal</a>.</i>\n\nCaso tenha alguma dúvida, envie /ajuda.\n\n<i>Versão do bot: 2.0</i>', { parse_mode: "HTML", reply_to_message_id: message.message_id, disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: "Começar a usar o bot", switch_inline_query: ""}]]}});

}

function privacy (bot, message) { 

  bot.sendMessage(message.chat.id, `Veja a [política de privacidade](https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16).\n\nConfira o código do bot no [GitHub](https://github.com/enzon19/dicionariobot).\n\nGerencie os dados que o bot tem sobre você no comando de configurações (/settings).`, { parse_mode: "Markdown" });

}

async function settings (bot, message, db) {

  if (message.chat.type == "private") {

    let news = await db.get(message.chat.id);
    if (![0, 1].includes(parseInt(news))) { news = 1; await db.set(message.chat.id, 1); }
  
    let shortcut = await db.get("shortcut_" + message.chat.id);
    const shortcutSettings = {"0": "definição", "1": "sinônimos", "2": "exemplos"};
    if (![0, 1, 2].includes(shortcut)) { shortcut = 0; await db.set("shortcut_" + message.chat.id, 0); }

    bot.sendMessage(message.chat.id, `<b>Configurações</b>\n\n• Atalho ao usar / no privado\nVocê pode escrever, por exemplo, /livro no chat privado para poder receber os sinônimos ou a definição. <u>Atualmente usando ${shortcutSettings[shortcut]}</u>.\n• Dados que o bot armazena sobre você\n<pre>Seu ID do Telegram: ${message.chat.id},\nTipo de atalho: ${shortcutSettings[shortcut]},\nRecebimento de divulgação e anúncios: ${["desativado", "ativado"][news]}</pre>\n\nPara${["", " poder parar de"][news]} receber divulgação de outros bots e anúncios, use /${["com_interesse", "sem_interesse"][news]}.`, { parse_mode: "HTML", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: {inline_keyboard: [[{text: "Atalho para " + shortcutSettings[(shortcut + 1) % 3], callback_data: "shortcut_" + shortcut}], [{text: "Deletar todos os meus dados", callback_data: "del_" + message.chat.id}]]}});

  } else {

    bot.sendMessage(message.chat.id, "Utilize seu chat privado com o bot para configurá-lo.", { reply_to_message_id: message.message_id, disable_notification: true });
    
  }

}

module.exports = {ping, start, privacy, settings}
