import type { Meaning } from "../models/Meaning";
import type { Synonyms } from "../models/Synonyms";
import type { Syllables } from "../models/Syllables";
import type { Sentence } from "../models/Sentence";
import {
  meaningsURL,
  synonymsURL,
  syllablesURL,
  sentencesURL,
  type ApiMeaningsResponse,
  type ApiSentencesResponse,
  type ApiSyllablesResponse,
  type ApiSynonymsResponse,
} from "../types/dicioApi";

async function fetchApi(url: string) {
  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) throw result;

  return result;
}

export async function getMeanings(word: string): Promise<Meaning[]> {
  const url = meaningsURL + encodeURIComponent(word);

  try {
    const result = (await fetchApi(url)) as ApiMeaningsResponse;

    return result.map((e) => ({
      ...e,
      etymology: !e.etymology || e.etymology == "" ? undefined : e.etymology,
    }));
  } catch (e: any) {
    console.error(e);
    return [];
  }
}

export async function getSynonyms(word: string): Promise<Synonyms> {
  const url = synonymsURL + encodeURIComponent(word);

  try {
    const result = (await fetchApi(url)) as ApiSynonymsResponse;

    return result;
  } catch (e: any) {
    console.error(e);
    return [];
  }
}

export async function getSyllables(word: string): Promise<Syllables> {
  const url = syllablesURL + encodeURIComponent(word);

  try {
    const result = (await fetchApi(url)) as ApiSyllablesResponse;

    return result;
  } catch (e: any) {
    console.error(e);
    return [];
  }
}

export async function getSentences(word: string): Promise<Sentence[]> {
  const url = sentencesURL + encodeURIComponent(word);

  try {
    const result = (await fetchApi(url)) as ApiSentencesResponse;

    return result;
  } catch (e: any) {
    console.error(e);
    return [];
  }
}
