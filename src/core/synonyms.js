'use strict';

// packages
const axios = require('axios');
const logError = require('./error');
const markdownEscaper = require('./markdownEscaper').normal;
const apiProviderUrl = 'enzon19.repl.co'//process.env.API_PROVIDER_URL;

function synonyms (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.${apiProviderUrl}/v2/synonyms/${encodeURIComponent(word)}`)
      ).data;
      const synonymsText = transformStructureToHumanReadable(responseWithJustData);

      resolve(`__*SINÔNIMOS DE ${markdownEscaper(word.toUpperCase())}*__\n\n${markdownEscaper(synonymsText)}`);
    } catch (e) {
      //logError(e);
      resolve([undefined, e.request.connection['_httpMessage'].res.statusCode]);
    }
  });
}

function transformStructureToHumanReadable (wordSynonyms) {
  return wordSynonyms.length > 0 ? wordSynonyms.join(', ') : 'Esta palavra não tem sinônimos cadastrados.';
}

module.exports = { synonyms };