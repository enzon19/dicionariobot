const axios = require("axios");
const global = require("./commands/_global");

function fixAuthor (author) {
  if (author.startsWith("- ")) { 
    return author.replace("- ", "");
  } else if (author == "") {
    return "Autor desconhecido";
  } else {
    return author;
  }
}

async function examples (word) {
  
  return new Promise((resolve) => {
    
    axios.get(`https://significado.herokuapp.com/v2/sentences/${encodeURIComponent(word)}`).then(async (res) => {
      const examplesData = res.data;
      let completeAnswer = "";
      
      for (let i = 0; i < examplesData.length; i++) {
        completeAnswer += `_${examplesData[i].sentence}_ — ${fixAuthor(examplesData[i].author)}\n\n`;
      }

      if (examplesData.length == 0) {
        resolve([undefined, 400]);
      } else {
        resolve(`*EXEMPLOS PARA ${word.toUpperCase()}*\n\n${completeAnswer}`.replace(/\n\n\n/g, "\n\n"));
      }
    }).catch(e => resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]));

  });

}

async function examplesMessage (bot, message, args) {

  if (!args) {

    bot.sendMessage(message.chat.id, "Respondendo essa mensagem, envia a palavra que você quer exemplos.", { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: { "force_reply": true, "selective": true } });

  } else {

    bot.sendChatAction(message.chat.id, "typing");

    let response = await examples(args.split(" ")[0]);
    
    if (response[0]) {

      bot.sendMessage(message.chat.id, response, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 400) {

      bot.sendMessage(message.chat.id, `Infelizmente, a palavra "${args.split(" ")[0]}" não tem exemplos cadastrados no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 503) {

      bot.sendMessage(message.chat.id, `Eita. Parece que o servidor que serve as informações do bot (banco de dados do dicionário) está fora do ar temporariamente. Infelizmente o Dicionário Bot não sou administra desse banco de dados e por isso não tem controle sobre o servidor. Tudo que podemos fazer no momento é esperar.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else {

      bot.sendMessage(message.chat.id, `Eita. Houve um erro ao procurar por esta palavra no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    }

  }

}

module.exports = {examplesMessage, examples}