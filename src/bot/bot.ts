import { Bot } from "grammy";
const TG_TOKEN = process.env.TG_TOKEN;

if (!TG_TOKEN) throw new Error("TG_TOKEN não definido");

export const bot = new Bot(TG_TOKEN);
