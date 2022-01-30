const axios = require("axios");
const global = require("./commands/_global");

async function define (word) {

  let wordResult = [];
  
  return new Promise((resolve, reject) => {

    axios.get(`https://significado.herokuapp.com/meanings/${word}`).then(async(res) => {

      for (j = 0; j < res.data.length; j++) {

        wordResult.push({gramaticalClass: res.data[j].class, means: "*Definições:*", etymology: res.data[j].etymology});

        if (res.data[j].class) wordResult[j].gramaticalClass = "*Classe: *" + global.capitalize(res.data[j].class);

        for (k = 0; k < res.data[j].meanings.length; k++) {

          wordResult[j].means = wordResult[j].means + "\n• " + res.data[j].meanings[k];

        }
      
      }

      let getSyllables;

      try {

        getSyllables = await axios.get(`https://significado.herokuapp.com/syllables/${word}`);

      } catch (err) {
      } finally {
        
        let completeAnswer = "";
        if (getSyllables) completeAnswer = `*Sílabas:* ${getSyllables.data.syllablesText} (${getSyllables.data.syllablesCount})\n\n`;
        
        for (i = 0; i < wordResult.length; i++) {

          if (wordResult[i].etymology == "") {
            
            completeAnswer += wordResult[i].gramaticalClass + "\n" + wordResult[i].means + "\n\n";

          } else {

            completeAnswer += wordResult[i].gramaticalClass + "\n" + wordResult[i].means + "\n\n*Etimologia: *" + wordResult[i].etymology + "\n\n";

          }

        }

          resolve(`*SIGNIFICADO DE ${word.toUpperCase()}*\n\n${completeAnswer}`);
          console.log(resol)

      }

    }).catch(e => resolve(undefined));

  });

}

async function defineMessage (bot, message, args) {

  if (!args) {

    bot.sendMessage(message.chat.id, "Respondendo essa mensagem, envia a palavra que você quer definir.", { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: { "force_reply": true, "selective": true } });

  } else {

    bot.sendChatAction(message.chat.id, "typing");

    let response = await define(args.split(" ")[0]);

    if (response) {

      bot.sendMessage(message.chat.id, response, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else {

      bot.sendMessage(message.chat.id, `Infelizmente, a palavra "${args.split(" ")[0]}" não está cadastrada no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    }

  }

}

module.exports = {defineMessage, define}