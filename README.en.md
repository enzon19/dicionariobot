<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/enzon19/dicionariobot/main/images/logo/favicon.png" alt="Dicionário Bot" width="187" height="187">
  <br><br>
    <img height="20px" src="https://img.shields.io/badge/Current%20version-v3.0-ee2919">
</p>

# Dicionário Bot

A dictionary of the Brazilian Portuguese language on Telegram. Get definitions, meanings and examples of any word. Use inline mode in any chat. Fix grammar mistakes in groups.

## Development

This project uses the [Dicio API](https://github.com/ThiagoNelsi/dicio-api) created by [ThiagoNelsi](https://github.com/ThiagoNelsi) as the dictionary source. The bot is hosted on [Replit](https://replit.com) and user information is stored in a database using [Supabase](https://supabase.com). The [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) library was also used to facilitate interaction with the Telegram API. Lastly, [bot's presentation website](https://dicionariobot.enzon19.com/) uses [Tailwind CSS](https://tailwindcss.com).

## Environment variables (.env)

```
TG_TOKEN=Token that @BotFather informs when creating a bot
SUPABASE_TOKEN=Anon
OWNER_ID=Bot owner's Telegram ID
NEWS_PASSWORD=Password to access the news maker
BOT_USERNAME=Bot username
API_PROVIDER_URL=Dictionary provider URL (significado.herokuapp.com)
```

## Updates

You can see the update notes on the [bot website](https://dicionariobot.enzon19.com/novidades).