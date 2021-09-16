<p align="center">
<img align="center" src="https://raw.githubusercontent.com/enzon19/dicionariobot/main/resources/Botpic.png" alt="Dicionário Bot" width="187" height="187">
</p>

# Dicionário Bot

Dicionário Bot is a Telegram bot that works normally or through inline mode.

# Introduction & About

I'm new to these languages, so probably the code and the methods aren't the better. The bot is hosted and made at [Replit](https://replit.com), and the token of the APIs are stored in .env files on Replit. When writing a word, returns the definition and synonyms. When writing a sentence, returns the entire sentence redone with synonyms and the definition of the first word. If you make a mistake, the bot might fix you or fix other members of a group.

*Atenttion: all of this is in portuguese.*

# Packages Used

Here's the list of all packages used:
- [axios](https://github.com/axios/axios) (for GET of the APIs)
- [express](https://github.com/expressjs/express) (for the server)
- [sinonimos](https://github.com/mateuspiresl/sinonimos) (for the /sinonimo command and the inline mode)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) (the base of the bot)
