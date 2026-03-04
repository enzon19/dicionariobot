<p align="center">
  <img src="./public/logo/Logopng.png" alt="Dicionário Bot Logo" height="120px" />
  <h1 align="center">
    Dicionário Bot
  </h1>

  <p align="center">
    A Brazilian Portuguese dictionary on Telegram.
    <br />
    <a href="https://t.me/dicionariobot"><strong>Open in Telegram »</strong></a>
    <br />
    <a href="https://dicionariobot.enzon19.com">Website</a>
  </p>

</p>

## About

Dicionário Bot is a bot for Telegram that gives you the Brazilian Portuguese dictionary directly in the app. Look up definitions (including definition per parts of speech, syllable breakdown and etymology), synonyms, and usage examples for any word.

You can use it in private conversations, invoke it inline in any chat by typing @dicionariobot, or add it to groups to automatically correct common spelling mistakes.

Dicionário Bot also offers shortcuts so you don't need to type a command every time and customizable search engines as a fallback when a word isn't found.

## Development

To reproduce the project locally for development or contribution:

1. **Clone the repository**

   ```bash
   git clone https://github.com/enzon19/dicionariobot.git
   cd dicionariobot
   ```

2. **Get a Telegram token**

   Message [@BotFather](https://t.me/botfather) on Telegram to register your bot and receive its authentication token.

3. **Create a Postgres database**

4. **Set up the environment variables**

   Copy `.env.example` to `.env` and fill in the values.

5. **Install dependencies, sync schema and run it**
   ```bash
   bun install
   bun run db
   bun .
   ```
