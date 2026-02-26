export default function removeTelegramHTML(html: string) {
	return html.replace(
		/<\/?(b|strong|i|em|u|ins|s|strike|del|span|tg-spoiler|a|tg-emoji|code|pre|blockquote)(\s[^>]*)?>/gi,
		''
	);
}
