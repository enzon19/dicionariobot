'use strict';

function removePunctuation(text) {
  return text.replace(/[^\w\s]/g, '');
}

function check(string, mistakesList) {
  // Split the string into an array of words
  const words = string.split(' ');
  let corrections = [];

  // Check each word in the array against the list of correct spellings
  for (const word of words) {
    const mistake = mistakesList.find(mistake => mistake.wrong == word);
    if (mistake) corrections.push(mistake.right + "*");
  }

  return corrections.join('\n');
}

module.exports = {removePunctuation, check};