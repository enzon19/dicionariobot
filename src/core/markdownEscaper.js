module.exports = function markdownEscaper(text, additional) {
  // initial
  text = text.replace(/([\[\]\(\)\~`<>#\+\-=|{}\.!\\])/g, '\\$1');
  // additional
  if (additional) text = text.replace(additional, '\\$1');
  return text;
}