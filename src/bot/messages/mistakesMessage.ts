import type { Context } from 'grammy';
import fs from 'fs';

type Mistake = {
	wrong: string;
	right: string;
};
const mistakesList: Mistake[] = JSON.parse(fs.readFileSync('public/mistakes.json', 'utf-8'));
const mistakeMap = new Map(mistakesList.map((m) => [m.wrong, m.right]));

export async function checkForMistakesAndBuildMessage(ctx: Context, text: string) {
	const normalizedText = text
		.toLowerCase()
		.replace(/[\p{P}]/gu, '')
		.trim();
	const words = normalizedText.split(/\s+/).filter((e) => e);

	const corrections = new Set<string>();

	for (const word of words) {
		const correction = mistakeMap.get(word);
		if (correction) corrections.add(correction + '*');
	}

	if (corrections.size == 0) return null;
	return [...corrections].join('\n');
}
