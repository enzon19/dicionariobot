"use strict";

const bot = global.bot;
const users = global.users;

// FAZER UM MARKDOWN ESCAPER REVERSO

async function parseInlineAndSaveUser(inline) {
  const nowFormatted = (new Date()).toISOString();

  users.upsert({
    id: inline.from.id,
    type: 'private',
    lastUseAt: nowFormatted
  });

  if (!inline.query || inline.query == " ") {
    bot.answerInlineQuery(inline.id, [], {
      switch_pm_text: "Escreva uma palavra para consultar",
      switch_pm_parameter: "byInline",
      cache_time: 1200
    });
    return;
  }

  const inlineResponse = await generateInlineResponse(inline);
  bot.answerInlineQuery(inline.id, inlineResponse);
}

async function generateInlineResponse (inline) {
  const word = inline.query;
  const args = word.split(' ')[0];

  const coreFileAndFunctionNames = ['define', 'synonyms', 'examples'];
  const titleTerms = ['DEFINIÇÃO DE ', 'SINÔNIMOS PARA ', 'EXEMPLOS PARA '];
  const peekMakersFunctions = [makeDefinitionPeek, makeSynonymsPeek, makeExemplesPeek]

  let inlineResponse = [];

  for (let index = 0; index < coreFileAndFunctionNames.length; index++) {
    const currentType = coreFileAndFunctionNames[index];
    
    const typeCore = require('../core/' + currentType);
    const response = await typeCore[currentType](args);

    if (response[0]) {
      inlineResponse.push({
        type: 'article',
        id: inline.from.id + `_${index}_` + word,
        title: titleTerms[index] + word.toUpperCase(),
        description: peekMakersFunctions[index](response),
        input_message_content: { message_text: response, parse_mode: 'MarkdownV2' }
      });
    } else if (response[1] == 400) {
      inlineResponse.push(...[undefined, `Palavra não está cadastrada no dicionário`]);
      break;
    } else if (response[1] == 503) {
      inlineResponse.push(...[undefined, `Servidor está fora do ar temporariamente`]);
      break;
    }
  }

  return inlineResponse;
}

function makeDefinitionPeek (text) {
  const definitions = text.match(/• (.*)/g);
  const rawDefinition = definitions[0].replace('• ', '');
  let definition = rawDefinition.substr(0, 99);
  if (definitions.length > 1 || rawDefinition.length > 99) definition += ' [...]';
  return definition;
}

function makeSynonymsPeek (text) {
  const rawSynonyms = text.split('__\n\n')[1];
  let synonym = rawSynonyms.substr(0, 99);
  if (rawSynonyms.length > 99) synonym += ' [...]';
  return synonym;
}

function makeExemplesPeek (text) {
  const examples = text.split('__\n\n')[1].match(/(_.*)/g);
  const rawDefinition = examples[0].replace(/^_(.*?)_ — (.*)/, '$1 — $2');
  let example = rawDefinition.substr(0, 99);
  if (examples.length > 1 || rawDefinition.length > 99) example += ' [...]';
  return example;
}

module.exports = { parseInlineAndSaveUser }