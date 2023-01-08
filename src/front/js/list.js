async function addList () {
  const dataURL = 'https://raw.githubusercontent.com/enzon19/dicionariobot/main/src/assets/json/mistakes.json';
  const mistakes = await (await fetch(dataURL)).json();
  let tableWithWords = '';

  for (const mistake of mistakes) {
    tableWithWords += `<tr class="tableRow">
  <td class="tableCell">${mistake.wrong}</td>
  <td class="tableCell">${mistake.right}</td>
</tr>`;
  }

  document.getElementById('mistakesList').innerHTML = tableWithWords;
}

document.addEventListener('DOMContentLoaded', addList);