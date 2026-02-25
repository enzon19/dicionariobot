const API_URL = process.env.API_URL;
if (!API_URL) throw new Error("API_URL não definida");

export const meaningsURL = `https://${API_URL}/v2/meanings/`;
export const sentencesURL = `https://${API_URL}/v2/sentences/`;
export const syllablesURL = `https://${API_URL}/v2/syllables/`;
export const synonymsURL = `https://${API_URL}/v2/synonyms/`;
