import { bot } from "./bot/bot";
import { server as createServer } from "./server";
const PORT = process.env.PORT;

async function main() {
  const server = await createServer();
  server.listen({ port: Number(PORT) || 2608 }, (err, address) => {
    if (err) console.error(err);
    console.info(`Dicionário Bot funcionando em ${address}.`);
  });

  bot.start();
  process.once("SIGINT", () => bot.stop());
  process.once("SIGTERM", () => bot.stop());
}

main();
