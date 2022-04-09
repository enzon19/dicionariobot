<p align="center">
    <img align="center" src="https://raw.githubusercontent.com/enzon19/dicionariobot/main/resources/Botpic.png" alt="Dicionário Bot" width="187" height="187">
    <br><br>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.md#20">
        <img height="20px" src="https://img.shields.io/badge/Current%20Version-v2.1-ee2919">
    </a>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.md">
        <img height="20px" src="https://img.shields.io/badge/EN-flag.svg?color=555555&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjAgMzAiIGhlaWdodD0iNjAwIj4NCjxkZWZzPg0KPGNsaXBQYXRoIGlkPSJ0Ij4NCjxwYXRoIGQ9Im0zMCwxNWgzMHYxNXp2MTVoLTMwemgtMzB2LTE1enYtMTVoMzB6Ii8+DQo8L2NsaXBQYXRoPg0KPC9kZWZzPg0KPHBhdGggZmlsbD0iIzAwMjQ3ZCIgZD0ibTAsMHYzMGg2MHYtMzB6Ii8+DQo8cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZD0ibTAsMGw2MCwzMG0wLTMwbC02MCwzMCIvPg0KPHBhdGggc3Ryb2tlPSIjY2YxNDJiIiBzdHJva2Utd2lkdGg9IjQiIGQ9Im0wLDBsNjAsMzBtMC0zMGwtNjAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIvPg0KPHBhdGggc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjxwYXRoIHN0cm9rZT0iI2NmMTQyYiIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjwvc3ZnPg0K">
    </a>
    <a align="center" href="https://github.com/enzon19/dicionariobot/blob/main/README.pt-BR.md">
        <img height="20px" src="https://img.shields.io/badge/PT--BR-green">
    </a>
</p>


# Dicionário Bot

Dicionário Bot is a Brazilian Portuguese dictionary on Telegram that works normally or through inline mode. When writing a word, returns the definition and synonyms. If you make a mistake, the bot might fix you or fix other members of a group.

# About the Development

The database comes from [Dicio API](https://github.com/ThiagoNelsi/dicio-api) made by [ThiagoNelsi](https://github.com/ThiagoNelsi). The bot is hosted and made at [Replit](https://replit.com), and the token of the APIs are stored in .env files on Replit.

*Attention: all of the bot it's in portuguese.*

---

# Updates
## 2.1
<details open>
<summary><b>News and Changes</b></summary>
    • <b><i>NEW!</i></b> \exemplos command. See sentences exemplifying the use of a word.<br>
    • Choose the examples as your default shortcut in private chat with the bot.<br>
    • Manage the data the bot has about you in the settings command (/settings). The bot saves your Telegram ID for receiving news and your settings, <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot- 09-16">learn more</a>.
</details>
<details open>
<summary><b>Bug Fixes</b></summary>
    • Accented words can now be found in the dictionary.<br>
    • More about accented words, words with the same spelling but different accents were getting the same meanings (such as metro and metrô).<br>
    • Button click in inline mode when having no answers now works.<br>
    • Some texts and instructions have been modified to standardize.
</details>

## 2.0
<details close>
<summary><b>News and Changes</b></summary>
    • <i><b>NEW!</b></i> It is now possible to just send /definir or /sinonimo and write a word replying to the bot's message. Try it, just click: /definir.<br>
    • <i><b>NEW!</b></i> Set up shortcuts for definition or synonyms of a word in private chat. For example, you can type /arroz in private chat with the bot to receive the definition of rice (arroz). If you prefer to receive synonyms, change this in /settings.<br>
    • <i><b>NEW!</b></i> Auxiliary commands like /settings and /help were added.<br>
    • Updated command order and description for all.<br>
    • Instead of just getting a synonym of the given word, get a list with all of them.<br>
</details>
<details close>
<summary><b>Bug Fixes</b></summary>
    • Synonyms are back in inline mode.
</details>
