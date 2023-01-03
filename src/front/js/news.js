function previewText () {
  const text = document.getElementById("text").value;
  const markdownParsed = text
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="tg-link" href="$2">$1</a>')
    .replace(/\n/g, '<br>');

  document.getElementById("previewText").innerHTML = markdownParsed;
}