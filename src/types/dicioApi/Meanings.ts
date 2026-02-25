// /meanings/[word]

interface Meaning {
  partOfSpeech: string;
  meanings: string[];
  etymology: string;
}

export type ApiMeaningsResponse = Meaning[];
