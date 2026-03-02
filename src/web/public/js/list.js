async function addList() {
	const dataURL = 'https://raw.githubusercontent.com/enzon19/dicionariobot/main/src/assets/json/mistakes.json';
	const response = await fetch(dataURL);

	const mistakes = response.ok ? await response.json() : [];
	const tbody = document.getElementById('mistakesList');
	tbody.innerHTML = '';

	if (mistakes.length == 0) tbody.innerHTML = '<tr><td colspan="2" class="text-center pt-2">Sem palavras.</td></tr>';

	for (const { wrong, right } of mistakes) {
		const tr = document.createElement('tr');
		tr.className = 'tableRow';

		const tdWrong = document.createElement('td');
		tdWrong.className = 'tableCell';
		tdWrong.textContent = wrong;

		const tdRight = document.createElement('td');
		tdRight.className = 'tableCell';
		tdRight.textContent = right;

		tr.append(tdWrong, tdRight);
		tbody.appendChild(tr);
	}
}

document.addEventListener('DOMContentLoaded', addList);
