'use strict';

// packages
const axios = require('axios');
const logError = require('./error');
const markdownEscaper = require('./markdownEscaper').normal;
const apiProviderUrl = 'enzon19.repl.co'//process.env.API_PROVIDER_URL;

function define (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.${apiProviderUrl}/v2/${encodeURIComponent(word)}`)
      ).data;
      const definitionText = transformStructureToHumanReadable(responseWithJustData);
      const syllables = await getSyllables(word);
      const syllablesText = `*Sílabas:* ${markdownEscaper(syllables.join('-'), /(\*|\_)/g)} \\(${syllables.length}\\)`;
      const rightWordSpelling = markdownEscaper(word.includes('-') ? word : syllables.join(''), /(\*|\_)/g);
      
      resolve(`__*DEFINIÇÃO DE ${rightWordSpelling.toUpperCase()}*__\n\n${syllablesText}\n\n${definitionText}`);
    } catch (e) {
      // logError(e);
      resolve([undefined, e.request.connection['_httpMessage'].res.statusCode]);
    }
  });
}

function getSyllables (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.${apiProviderUrl}/v2/syllables/${encodeURIComponent(word)}`)
      ).data;
      resolve(responseWithJustData);
    } catch (e) {
      logError(e);
      resolve(undefined);
    }
  });
}

function transformStructureToHumanReadable (wordDefinition) {
  // uma palavra pode ter mais de uma classe de palavra, por isso vou em cada objeto da lista e tornar pronto para leitura do usuário
  const wordDefinitionHumanReadable = wordDefinition.map(current => {
    //const current = wordDefinition[i];

    // Getting information
    const currentPartOfSpeech = current.partOfSpeech;
    const currentMeanings = current.meanings;
    const currentEtymology = current.etymology;

    // Se temos a informação, então adicione o texto identificando ela, se não, retorne ''. Ternário.
    const currentPartOfSpeechText = currentPartOfSpeech ? `*Classe:* ${markdownEscaper(currentPartOfSpeech, /(\*|\_)/g)}\n` : '';
    const currentEtymologyText = currentEtymology ? `\n\n*Etimologia:* ${markdownEscaper(currentEtymology.replace(/Etimologia \(origem da palavra .*\)\. /gi, ''), /(\*|\_)/g)}` : '';
    const currentMeaningsText = currentMeanings ? `*Definições:*\n${markdownEscaper(currentMeanings.map(meaning => '• ' + meaning).join('\n'), /(\*|\_)/g)}` : '';
    // ↑ No caso dos significados, a API retorna uma array. Vamos transformar isso em texto. ↑

    return currentPartOfSpeechText + currentMeaningsText + currentEtymologyText;
  });

  return wordDefinitionHumanReadable.join('\n\n');
}

module.exports = { define };