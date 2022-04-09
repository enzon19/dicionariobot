const requireFromString = require("require-from-string");
const global = require("./commands/_global");
const fs = require("fs");

async function inline (bot, inline, args) {

  const define = requireFromString(fs.readFileSync("./commands/define.js","utf8"));
  const synonym = requireFromString(fs.readFileSync("./commands/synonym.js","utf8"));
  const examples = requireFromString(fs.readFileSync("./commands/examples.js","utf8"));

  let word = args.split(' ')[0];

  let responseDefine = await define.define(word);
  let responseSynonym = await synonym.synonym(word);
  let responseExamples = await examples.examples(word);

  if (responseDefine[0] || responseSynonym[0] || responseExamples[0]) {

    // get images for the word

    let inlineAnswer = [];

    if (responseDefine[0]) {

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
    
    if (responseSynonym[0]) {

      let title = 'SINÔNIMOS DE ' + word.toUpperCase();
      let description = responseSynonym.substr(title.length + 2).replace(/\n/g, "");
      if (description.length > 99) description = description.substr(0, 99) + " [...]";

      inlineAnswer.push({ 

        type: 'article', 
        id: inline.from.id + "-syn-" + word,
        title: title,
        description: description,
        input_message_content: { message_text: responseSynonym, parse_mode: 'Markdown' }

      });

    }

    if (responseExamples[0]) {

      let description = "";
      let title = 'EXEMPLOS PARA ' + word.toUpperCase();
      description = responseExamples.substr(title.length + 2).replace(/\n/g, " ").replace(/_/g, "");
      if (description.length > 99) description = description.substr(0, 99) + " [...]";

      inlineAnswer.push({ 

        type: 'article', 
        id: inline.from.id + "-epl-" + word,
        title: title,
        description: description,
        input_message_content: { message_text: responseExamples, parse_mode: 'Markdown' }

      });

    }

    bot.answerInlineQuery(inline.id, inlineAnswer, { cache_time: 1200 });

  } else {

    bot.answerInlineQuery(inline.id, [], {switch_pm_text: "Escreva uma palavra válida para consultar", switch_pm_parameter: "byInline", cache_time: 1200});

  }
  

}

module.exports = {inline}