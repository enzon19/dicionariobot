const requireFromString = require("require-from-string");
const fs = require("fs");

async function inline (bot, inline, args) {

  const define = requireFromString(fs.readFileSync("./commands/define.js","utf8"));
  const synonym = requireFromString(fs.readFileSync("./commands/synonym.js","utf8"));

  let word = args.split(' ')[0];

  let responseDefine = await define.define(word);
  let responseSynonym = await synonym.synonym(word);

  if (responseDefine || responseSynonym) {

    let inlineAnswer = [];

    if (responseDefine) {

      let description = "";
      let title = 'SIGNIFICADO DE ' + word.toUpperCase();
      if (responseDefine.split("Definições:*\n• ")[1]) description = responseDefine.split("Definições:*\n• ")[1].replace(/\n•/g, " - ").replace(/\n/g, "").split("*Etimologia:")[0].split("*Classe:")[0];
      if (description.length > 99 || responseDefine.split("Definições:*\n• ").length > 3) description = description.substr(0, 99) + " [...]";

      inlineAnswer.push({ 

        type: 'article', 
        id: inline.from.id + "-def-" + word,
        title: title,
        description: description,
        input_message_content: { message_text: responseDefine, parse_mode: 'Markdown' }

      });

    }
    
    if (responseSynonym) {

      let title = 'SINÔNIMOS PARA ' + word.toUpperCase();
      let description = responseSynonym.substr(title.length).replace(/\n/g, "");
      if (description.length > 99) description = description.substr(0, 99) + " [...]";

      inlineAnswer.push({ 

        type: 'article', 
        id: inline.from.id + "-syn-" + word,
        title: title,
        description: description,
        input_message_content: { message_text: responseSynonym, parse_mode: 'Markdown' }

      });

    }

    bot.answerInlineQuery(inline.id, inlineAnswer, { cache_time: 60 });

  } else {

    bot.answerInlineQuery(inline.id, [], {switch_pm_text: "Escreva uma palavra válida para definição", switch_pm_parameter: "start", cache_time: 60});

  }
  

}

module.exports = {inline}