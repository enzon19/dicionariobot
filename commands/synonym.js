const axios = require("axios");
const global = require("./commands/_global");

async function synonym (word) {
  
  return new Promise((resolve, reject) => {

    axios.get(`https://significado.herokuapp.com/synonyms/${word}`).then(async(res) => {

      if (res.data[0]) {
        
        resolve(`*SINÔNIMOS DE ${word.toUpperCase()}*\n\n${res.data.join(", ")}`);
        
      } else {

        resolve(undefined);

      }

    }).catch(e => resolve(undefined));

  });

}

async function synonymMessage (bot, message, args) {

  if (!args) {

    bot.sendMessage(message.chat.id, "Respondendo essa mensagem, envia a palavra que você quer sinônimos.", { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: { "force_reply": true, "selective": true } });

  } else {

    bot.sendChatAction(message.chat.id, "typing");

    let response = await synonym(args.split(" ")[0]);

    if (response) {

      bot.sendMessage(message.chat.id, response, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else {

      bot.sendMessage(message.chat.id, `Infelizmente, a palavra "${args.split(" ")[0]}" não tem sinônimos.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    }

  }

}

module.exports = {synonymMessage, synonym}