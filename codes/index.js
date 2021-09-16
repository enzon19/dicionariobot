process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = process.env['telegram_token'];
const bot = new TelegramBot(token, { polling: true });
const axios = require("axios");
const sinonimos = require('node-sinonimos');
const fs = require('fs');

let returned = [];
let idlog = parseFloat(fs.readFileSync(__dirname + '/idlog.txt'));
let i, j, k;

bot.on('message', (msg) => {

  let content = msg.text.toString().toLowerCase();

	if (content.startsWith("/")) {

    let command = content.split(' ')[0];
    let args = content.replace(command + " ", "");

		switch (command) {

			case '/start':
			case '/start@dicionariobot':

				bot.sendMessage(msg.chat.id, '<b>Dicionário Bot (dicionariobot)</b>\n\nO Dicionário Bot funciona normalmente ou através do modo inline, ou seja, ao escrever @dicionariobot e pesquisar por uma palavra ou escrever uma frase. Ele também funciona no pv usando <code>/definir</code> ou <code>/sinonimo</code>. Ao escrever uma palavra, retorna a definição e os sinônimos. Ao escrever uma frase, retorna a frase inteira refeita com sinônimos e a definição da primeira palavra. Se você cometer um erro, o bot talvez te corrija ou corrija outros membros de um grupo. <a href="https://github.com/enzon19/dicionariobot">Qualquer pessoa pode usar o bot, ver o código principal e criar códigos baseados</a>.\n\n<i>O desenvolvedor deste bot leva a privacidade a sério, por isso você pode checar a <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16">política de privacidade informal</a>.</i>\n\nCaso tenha alguma dúvida, envie /ajuda.\n\n<i>Versão do bot: 0.1 (BETA)</i>', { parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: "Começar a usar o bot", switch_inline_query: ""}]]}});

			break;

			case '/definir':
      case '/definir@dicionariobot':

				if (args == "/definir" || args == "/definir@dicionariobot") {

					bot.sendMessage(msg.chat.id, "Você não informou nenhuma palavra.\n\nExemplo: `/definir dicionário`", { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true });

				} else {

          bot.sendChatAction(msg.chat.id, "typing");

          let wordsto = args.split(' ')[0];
          let wordresult = [];
          let sylCount = 0;
          let syls;

          axios.get(`https://significado.herokuapp.com/meanings/${wordsto}`).then(async(res) => {

            for (j = 0; j < res.data.length; j++) {

              wordresult.push({gramaticalClass: res.data[j].class, means: "*Definições: *", etymology: res.data[j].etymology});

              if (res.data[j].class != "" && res.data[j].class != undefined) wordresult[j].gramaticalClass = "*Classe:*" + capitalizeLetters(res.data[j].class);

              for (k = 0; k < res.data[j].meanings.length; k++) {

                wordresult[j].means = wordresult[j].means + "\n• " + res.data[j].meanings[k];

              }
            
            }

            axios.get(`https://significado.herokuapp.com/syllables/${wordsto}`).then(async(res) => { 
              
              sylsCount = res.data.syllablesCount; 
              syls = res.data.syllablesText; 
              let completeAnswer = "";

              for (i = 0; i < wordresult.length; i++) {

                if (wordresult[i].etymology == "") {
                  
                  completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n"

                } else {

                  completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n*Etimologia: *" + wordresult[i].etymology + "\n\n"

                }

              }

              bot.sendMessage(msg.chat.id,  `*SIGNIFICADO DE ${wordsto.toUpperCase()}*\n\n*Sílabas:* ${syls} (${sylsCount})\n\n${completeAnswer}`, { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true });
              
            }).catch((e) => {

              let completeAnswer = "";

              for (i = 0; i < wordresult.length; i++) {

                if (wordresult[i].etymology == "") {
                  
                  completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n"

                } else {

                  completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n*Etimologia: *" + wordresult[i].etymology + "\n\n"

                }

              }

              bot.sendMessage(msg.chat.id,  `*SIGNIFICADO DE ${wordsto.toUpperCase()}*\n\n${completeAnswer}`, { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true });

            });

          }).catch((e) => {

            bot.sendMessage(msg.chat.id, `Infelizmente, a palavra "${wordsto}" não está cadastrada no dicionário.`, { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true });

          });

				}

			break;

      case '/sinonimo':
      case '/sinonimo@dicionariobot':

				if (args == "/sinonimo" || args == "/sinonimo@dicionariobot") {

					bot.sendMessage(msg.chat.id, "Você não informou nenhuma palavra ou frase.\n\nExemplo: `/sinonimo O livro está em cima da mesa`", { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true });

				} else {

          bot.sendChatAction(msg.chat.id, "typing");

          getSynonym(args);

          async function getSynonym(text) {

            let words = text.split(' ');
            let result = "";
            let newWord;

            for (i = 0; i < words.length; i++) {

              newWord = await sinonimos(words[i]);

              if (![undefined, [], ""].includes(newWord[1]) && !["o", "e", "um", "são", "é"].includes(words[i])) {

                result += " " + newWord[1];

              } else {

                result += " " + words[i];

              }

            }
            

            bot.sendMessage(msg.chat.id,  `*SINÔNIMOS*\n\n*Texto alterado:*${result}`, { parse_mode: "Markdown", reply_to_message_id: msg.message_id, disable_notification: true, reply_markup: { inline_keyboard: [[{text: "Regenerar", callback_data: 1}]]} });
        
          }

        }

      break;

      case '/ping':

				bot.sendMessage(msg.chat.id, `Pong! 🏓`);

			break;


		}

	}

});

bot.on('inline_query', (msg) =>{

	returned = [];

	let means = "";
	
	idlog = idlog + 1
	fs.writeFileSync(__dirname + '/idlog.txt', idlog);

	if (msg.query != "") getDef(msg.query.toLowerCase());

	async function getDef(text) {

		let wordsto = text.split(' ')[0];
    let wordresult = [];
    let sylCount = 0;
    let syls;

    axios.get(`https://significado.herokuapp.com/meanings/${wordsto}`).then(async(res) => {

      for (j = 0; j < res.data.length; j++) {

        wordresult.push({gramaticalClass: res.data[j].class, means: "*Definições: *", etymology: res.data[j].etymology});

        if (res.data[j].class != "" && res.data[j].class != undefined) wordresult[j].gramaticalClass = "*Classe:*" + capitalizeLetters(res.data[j].class);

        for (k = 0; k < res.data[j].meanings.length; k++) {

          wordresult[j].means = wordresult[j].means + "\n• " + res.data[j].meanings[k];

        }
      
      }

      axios.get(`https://significado.herokuapp.com/syllables/${wordsto}`).then(async(res2) => { 
        
        sylsCount = res2.data.syllablesCount; 
        syls = res2.data.syllablesText; 
        let completeAnswer = "";

        for (i = 0; i < wordresult.length; i++) {

          if (wordresult[i].etymology == "") {
            
            completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n"

          } else {

            completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n*Etimologia: *" + wordresult[i].etymology + "\n\n"

          }

        }

        returned.push({ 

									type: 'article', 
									id: idlog + "-def-" + wordsto,
									title: 'Significado de ' + wordsto,
									description: res.data[0].meanings[0].substr(0, 35) + "...",
									input_message_content: { message_text: `*SIGNIFICADO DE ${wordsto.toUpperCase()}*\n\n*Sílabas:* ${syls} (${sylsCount})\n\n${completeAnswer}`, parse_mode: 'Markdown' }

								});
        
        }).catch((e) => {

          let completeAnswer = "";

          for (i = 0; i < wordresult.length; i++) {

            if (wordresult[i].etymology == "") {
              
              completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n"

            } else {

              completeAnswer = completeAnswer + wordresult[i].gramaticalClass + "\n" + wordresult[i].means + "\n\n*Etimologia: *" + wordresult[i].etymology + "\n\n"

            }

          }

          returned.push({ 

                    type: 'article', 
                    id: idlog + "-def-" + wordsto,
                    title: 'Significado de ' + wordsto,
                    description: res.data[0].meanings[0].substr(0, 35) + "...",
                    input_message_content: { message_text: `*SIGNIFICADO DE ${wordsto.toUpperCase()}*\n\n${completeAnswer}`, parse_mode: 'Markdown' }

                  });

        });

      getSynonym(msg.query.toLowerCase());

      async function getSynonym(text) {

        let words = text.split(' ');
        let result = "";
        let newWord;

        for (i = 0; i < words.length; i++) {

          newWord = await sinonimos(words[i]);

          if (![undefined, [], ""].includes(newWord[0]) && !["o", "e", "um", "são", "é"].includes(words[i])) {
            
            result += " " + newWord[0];

          } else {

            result += " " + words[i];

          }

        }

        returned.push({ 

                  type: 'article', 
                  id: idlog + "-1" + msg.id,
                  title: '1ª Opção de Sinônimo',
                  description: result,
                  input_message_content: { message_text: result }

                });

        result = "";

        for (i = 0; i < words.length; i++) {

          newWord = await sinonimos(words[i]);

          if (![undefined, [], ""].includes(newWord[1]) && !["o", "e", "um", "são", "é"].includes(words[i])) {

            result += " " + newWord[1];

          } else {

            result += " " + words[i];

          }

        }

        returned.push({ 

                  type: 'article', 
                  id: idlog + "-2" + msg.id,
                  title: '2ª Opção de Sinônimo',
                  description: result,
                  input_message_content: { message_text: result }

                });

        result = "";

        for (i = 0; i < words.length; i++) {

          newWord = await sinonimos(words[i]);

          if (![undefined, [], ""].includes(newWord[newWord.length - 1]) && !["o", "e", "um", "são", "é"].includes(words[i])) {

            result += " " + newWord[newWord.length - 1];

          } else {

            result += " " + words[i];

          }

        }

        if (result != " undefined") {
          
          returned.push({ 

                    type: 'article', 
                    id: idlog + "-3" + msg.id,
                    title: '3ª Opção de Sinônimo',
                    description: result,
                    input_message_content: { message_text: result }

                  });

        }
        

        bot.answerInlineQuery(msg.id, returned, {cache_time: 1});
    
      }

    });

  }

});

bot.on("callback_query", (callbackQuery) => {

	let msg = callbackQuery.message
  let content = callbackQuery.message.reply_to_message.text.toString().toLowerCase();
  let command = content.split(' ')[0];
  let args = content.replace(command + " ", "");

	if (callbackQuery.data >= 0) {

    getSynonym(args);

    async function getSynonym(text) {

      let words = text.split(' ');
      let result = "";
      let newWord;

      if (callbackQuery.data == 2) {

          for (i = 0; i < words.length; i++) {

          newWord = await sinonimos(words[i]);

          if (![undefined, [], ""].includes(newWord[newWord.length - 1]) && !["o", "e", "um", "são", "é"].includes(words[i])) {

            result += " " + newWord[newWord.length - 1];

          } else {

            result += " " + words[i];

          }

        }

      } else {

        for (i = 0; i < words.length; i++) {

        newWord = await sinonimos(words[i]);

        if (![undefined, [], ""].includes(newWord[otherOption(parseFloat(callbackQuery.data))]) && !["o", "e", "um", "são", "é"].includes(words[i])) {

          result += " " + newWord[otherOption(parseFloat(callbackQuery.data))];

        } else {

          result += " " + words[i];

        }

      }

      }

      bot.editMessageText(`*SINÔNIMOS*\n\n*Texto alterado:*${result}`, { chat_id: msg.chat.id, message_id: msg.message_id, parse_mode: "Markdown", disable_notification: true, reply_markup: { inline_keyboard: [[{text: "Regenerar", callback_data: (otherOption(parseFloat(callbackQuery.data)))}]]} });
  
    }

	}

});

function otherOption (choosedNumber) {

	switch (choosedNumber) {

		case 1:

			return 2;

		break;

		case 2:

			return 0;

		break;

    case 0:

			return 1;

		break;

	}

}

function capitalizeLetters(sentence) {

  return sentence.split(" ").reduce((a, c) => a + " " + c[0].toUpperCase() + c.substr(1), "").replace(/E/g,'e');

}

bot.on('polling_error', error => console.log(error));

require('./server')();
