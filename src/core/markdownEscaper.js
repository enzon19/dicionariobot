module.exports = function markdownEscaper(text, additional) {
  // initial
  text = text.replace(/(\[|\]|\(|\)|\~|\`|\>|\#|\+|\-|\=|\||\{|\}|\.|\!|\\)/g, '\\$1');
  // additional
  text = additional ? text.replace(additional, '\\$1'): text;
  return text;
}