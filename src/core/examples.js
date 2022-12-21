"use strict";

// packages
const axios = require("axios");
const logError = require('./error');
const markdownEscaper = require('./markdownEscaper');
const apiProviderUrl = process.env.API_PROVIDER_URL;

function examples (word) {
  return new Promise(async (resolve) => {
    try {
      const responseWithJustData = (
        await axios.get(`https://significado.${apiProviderUrl}/v2/sentences/${encodeURIComponent(word)}`)
      ).data;
      const examplesText = transformStructureToHumanReadable(responseWithJustData);

      resolve(`__*EXEMPLOS PARA ${markdownEscaper(word.toUpperCase())}*__\n\n${examplesText}`);
    } catch (e) {
      //logError(e);
      resolve([undefined, e.request.connection["_httpMessage"].res.statusCode]);
    }
  });
}

function transformStructureToHumanReadable (wordExamples) {
  if (wordExamples.length > 0) {
    // a API retorna uma array com a frase e o autor, quero informar os dois
    const wordExamplesHumanReadable = wordExamples.map(current => {
      // Getting information
      const currentExample = current.sentence;
      const currentAuthor = current.author;

      return `_${markdownEscaper(currentExample)}_ — ${markdownEscaper(fixAuthor(currentAuthor))}`;
    });

    return wordExamplesHumanReadable.join('\n\n');
  } else {
    return 'Esta palavra não tem exemplos cadastrados.';
  }
}

function fixAuthor (author) {
  if (author.startsWith("- ")) { 
    return author.replace("- ", "");
  } else if (author == "") {
    return "Autor desconhecido";
  } else {
    return author;
  }
}

module.exports = { examples };