function normal (text, additional, reverse) {
  // initial
  text = text.toString().replace(/([\[\]\(\)\~`<>#\+\-=|{}\.!\\])/g, '\\$1');
  // additional
  if (additional) text = text.replace(additional, '\\$1');
  // reverse
  if (reverse) text = text.replace(reverse, '$1');
  return text;
}

function reverse(text, additional) {
  // initial
  text = text.replace(/\\([\[\]\(\)\~`<>#\+\-=|{}\.!\\])/g, '$1');
  // additional
  if (additional) text = text.replace(additional, '$1');
  return text;
}

module.exports = {normal, reverse}