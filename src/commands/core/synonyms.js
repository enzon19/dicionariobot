"use strict";

// packages
const axios = require("axios");
const logError = require('./src/commands/core/error.js');
const markdownEscaper = require('./src/commands/core/markdownEscaper.js');

function synonyms (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.herokuapp.com/v2/synonyms/${encodeURIComponent(word)}`)
      ).data;
      const synonymsText = transformStructureToHumanReadable(responseWithJustData);

      resolve(`__*SINÔNIMOS DE ${markdownEscaper(word.toUpperCase())}*__\n${markdownEscaper(synonymsText)}`);
    } catch (e) {
      //logError(e);
      resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]);
    }
  });
}

function transformStructureToHumanReadable (wordSynonyms) {
  return wordSynonyms.length > 0 ? wordSynonyms.join(', ') : 'Esta palavra não tem sinônimos cadastrados.';
}

module.exports = { synonyms };