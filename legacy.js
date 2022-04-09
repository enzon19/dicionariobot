let command = content.split(' ')[0];
      let args = content.replace(command + " ", "");

      switch (command) {

        case '/start':
        case '/start@dicionariobot':

          bot.sendMessage(msg.chat.id, '<b>Dicionário Bot (dicionariobot)</b>\n\nO Dicionário Bot funciona normalmente ou através do modo inline, ou seja, ao escrever @dicionariobot e pesquisar por uma palavra ou escrever uma frase. Ele também funciona no pv usando <code>/definir</code> ou <code>/sinonimo</code>. Ao escrever uma palavra, retorna a definição (ou os sinônimos). Ao escrever uma frase, retorna a frase inteira refeita com sinônimos e a definição da primeira palavra. Se você cometer um erro, o bot talvez te corrija ou corrija outros membros de um grupo. <a href="https://github.com/enzon19/dicionariobot">Qualquer pessoa pode usar o bot, ver o código principal e criar códigos baseados</a>.\n\n<i>O desenvolvedor deste bot leva a privacidade a sério, por isso você pode checar a <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16">política de privacidade informal</a>.</i>\n\nCaso tenha alguma dúvida, envie /ajuda.\n\n<i>Versão do bot: 1.0 (BETA)</i>', { parse_mode: "HTML", reply_to_message_id: msg.message_id, disable_notification: true, disable_web_page_preview: true, reply_markup: {inline_keyboard: [[{text: "Começar a usar o bot", switch_inline_query: ""}]]}});

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

        case '/privacy':
        case '/privacy@dicionariobot':

          bot.sendMessage(msg.chat.id, `Veja a [política de privacidade](https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16).\n\nConfira o código do bot no [GitHub](https://github.com/enzon19/dicionariobot).`, { parse_mode: "Markdown" });

        break;

        case '/help':
        case '/help@dicionariobot':
        case '/ajuda':
        case '/ajuda@dicionariobot':

          bot.sendMessage(msg.chat.id, `Use o comando \`/definir <palavra>\` para receber a definição de uma palavra.\nUse o comando \`/sinonimo <palavra>\` para receber o sinônimo de uma palavra.\n\nUse o modo inline para receber definições em qualquer chat.\n\nAdicione o bot em um grupo para que ele possa corrigir erros absurdos (não são todos).`, { parse_mode: "Markdown" });

        break;

        case '/add':

          if (msg.from.id == "1097090528") {

            list[0].push(removeAccents.remove(content.split(" ")[1].split("_")[0]));
            list[1].push(content.split("_")[1]);

            fs.writeFileSync('./list.json', JSON.stringify(list, null, 2));
            bot.sendMessage(1097090528, "Cadastrado.");

          }

        break;

      }