const axios = require("axios");
const global = require("./commands/_global");

function getSyllables (word) {

  return new Promise((resolve) => {
    
    axios.get(`https://significado.herokuapp.com/v2/syllables/${encodeURIComponent(word)}`).then(res => resolve(res.data)).catch(() => resolve(undefined));
                                                                                                     
  });
  
}

async function define (word) {

  let wordResult = [];
  
  return new Promise((resolve) => {
    
    axios.get(`https://significado.herokuapp.com/v2/${encodeURIComponent(word)}`).then(async (res) => {
      
      for (j = 0; j < res.data.length; j++) {

        wordResult.push({gramaticalClass: res.data[j].partOfSpeech, means: "*Definições:*", etymology: res.data[j].etymology});

        if (res.data[j].partOfSpeech) wordResult[j].gramaticalClass = "*Classe: *" + global.capitalize(res.data[j].partOfSpeech);

        for (k = 0; k < res.data[j].meanings.length; k++) {

          wordResult[j].means = wordResult[j].means + "\n• " + res.data[j].meanings[k];

        }
      
      }

      let labelWord = word.toUpperCase();
      let syllables = await getSyllables(word);
      let completeAnswer = "";
      if (syllables) {
        completeAnswer = `*Sílabas:* ${syllables.join("-")} (${syllables.length})\n\n`;
        if (!labelWord.includes("-")) labelWord = syllables.join("").toUpperCase();
      }
      
      for (i = 0; i < wordResult.length; i++) {

        if (wordResult[i].etymology == "") {
          
          completeAnswer += wordResult[i].gramaticalClass + "\n" + wordResult[i].means + "\n\n";

        } else {

          completeAnswer += wordResult[i].gramaticalClass + "\n" + wordResult[i].means + "\n\n*Etimologia: *" + wordResult[i].etymology + "\n\n";

        }

      }
      
      resolve(`*SIGNIFICADO DE ${labelWord}*\n\n${completeAnswer}`.replace(/\n\n\n/g, "\n\n"));

    }).catch(e => resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]));

  });

}

async function defineMessage (bot, message, args) {

  if (!args) {

    bot.sendMessage(message.chat.id, "Respondendo essa mensagem, envia a palavra que você quer definir.", { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true, reply_markup: { "force_reply": true, "selective": true } });

  } else {

    bot.sendChatAction(message.chat.id, "typing");

    let response = await define(args.split(" ")[0]);
    
    if (response[0]) {

      bot.sendMessage(message.chat.id, response, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 400) {

      bot.sendMessage(message.chat.id, `Infelizmente, a palavra "${args.split(" ")[0]}" não está cadastrada no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else if (response[1] == 503) {

      bot.sendMessage(message.chat.id, `Eita. Parece que o servidor que serve as informações do bot (banco de dados do dicionário) está fora do ar temporariamente. Infelizmente o Dicionário Bot não administra esse banco de dados e por isso não tem controle sobre o servidor. Tudo que podemos fazer no momento é esperar.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    } else {

      bot.sendMessage(message.chat.id, `Eita. Houve um erro ao procurar por esta palavra no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: message.message_id, disable_notification: true });

    }

  }

}

module.exports = {defineMessage, define}