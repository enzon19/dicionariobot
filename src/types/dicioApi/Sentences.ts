// /sentences/[word]

interface Sentence {
	sentence: string;
	author: string;
}

export type ApiSentencesResponse = Sentence[];
