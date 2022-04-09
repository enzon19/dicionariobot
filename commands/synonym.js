const axios = require("axios");
const global = require("./commands/_global");

async function synonym (word) {
  
  return new Promise((resolve, reject) => {

    axios.get(`https://significado.herokuapp.com/v2/synonyms/${encodeURIComponent(word)}`).then(async(res) => {

      if (res.data[0]) {
        
        resolve(`*SINÔNIMOS DE ${word.toUpperCase()}*\n\n${res.data.join(", ")}`);
        
      } else {

        resolve([undefined, 400]);

      }

    }).catch(e => resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]));

  });

}

async function synonymMessage (bot, message, args) {

  if (!args) {

    bot.sendMessage(message.chat.id, "Respondendo essa mensagem, envia a palavra que você quer sinônimos.", { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: { "force_reply": true, "selective": true } });

  } else {

    bot.sendChatAction(message.chat.id, "typing");

    let response = await synonym(args.split(" ")[0]);

    if (response[0]) {

      bot.sendMessage(message.chat.id, response, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 400) {

      bot.sendMessage(message.chat.id, `Infelizmente, a palavra "${args.split(" ")[0]}" não tem sinônimos.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 503) {

      bot.sendMessage(message.chat.id, `Eita. Parece que o servidor que serve as informações do bot (banco de dados do dicionário) está fora do ar temporariamente. Infelizmente o Dicionário Bot não administra esse banco de dados e por isso não tem controle sobre o servidor. Tudo que podemos fazer no momento é esperar.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else {

      bot.sendMessage(message.chat.id, `Eita. Houve um erro ao procurar por esta palavra no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    }

  }

}

module.exports = {synonymMessage, synonym}