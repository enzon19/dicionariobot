"use strict";

// packages
const axios = require("axios");
const logError = require('./src/commands/core/error.js');

function define (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.herokuapp.com/v2/${encodeURIComponent(word)}`)
      ).data;
      const definitionText = transformStructureToHumanReadable(responseWithJustData);
      const syllables = await getSyllables(word);
      const syllablesText = `*Sílabas:* ${syllables.join('-')} (${syllables.length})`;
      const rightWordSpelling = word.includes('-') ? word : syllables.join('');
      
      resolve(`*SIGNIFICADO DE ${rightWordSpelling.toUpperCase()}*\n${syllablesText}\n\n${definitionText}`);
    } catch (e) {
      //logError(e);
      resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]);
    }
  });
}

function getSyllables (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.herokuapp.com/v2/syllables/${encodeURIComponent(word)}`)
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
    const currentPartOfSpeechText = currentPartOfSpeech ? `*Classe:* ${currentPartOfSpeech}\n` : '';
    const currentEtymologyText = currentEtymology ? `\n\n*Etimologia:* ${currentEtymology.replace(/Etimologia \(origem da palavra .*\)\. /gi, '')}` : '';
    const currentMeaningsText = currentMeanings ? `*Definições:*\n${currentMeanings.map(meaning => '• ' + meaning).join('\n')}` : '';
    // ↑ No caso dos significados, a API retorna uma array. Vamos transformar isso em texto. ↑

    return currentPartOfSpeechText + currentMeaningsText + currentEtymologyText;
  });

  return wordDefinitionHumanReadable.join('\n\n');
}

define('aasd');

module.exports = { define };
