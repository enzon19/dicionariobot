<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/enzon19/dicionariobot/main/resources/Botpic.png" alt="Dicionário Bot" width="187" height="187">
  <br><br>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.pt-BR.md#20">
        <img height="20px" src="https://img.shields.io/badge/Vers%C3%A3o%20Atual-v3.0-ee2919">
    </a>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.md">
        <img height="20px" src="https://img.shields.io/badge/Read%20in%20English-flag.svg?color=555555&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjAgMzAiIGhlaWdodD0iNjAwIj4NCjxkZWZzPg0KPGNsaXBQYXRoIGlkPSJ0Ij4NCjxwYXRoIGQ9Im0zMCwxNWgzMHYxNXp2MTVoLTMwemgtMzB2LTE1enYtMTVoMzB6Ii8+DQo8L2NsaXBQYXRoPg0KPC9kZWZzPg0KPHBhdGggZmlsbD0iIzAwMjQ3ZCIgZD0ibTAsMHYzMGg2MHYtMzB6Ii8+DQo8cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZD0ibTAsMGw2MCwzMG0wLTMwbC02MCwzMCIvPg0KPHBhdGggc3Ryb2tlPSIjY2YxNDJiIiBzdHJva2Utd2lkdGg9IjQiIGQ9Im0wLDBsNjAsMzBtMC0zMGwtNjAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIvPg0KPHBhdGggc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjxwYXRoIHN0cm9rZT0iI2NmMTQyYiIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjwvc3ZnPg0K">
    </a>
</p>

# Dicionário Bot

Um dicionário da língua portuguesa brasileira no Telegram. Receba definições, sinônimos e exemplos de qualquer palavra. Use o modo inline em qualquer bate-papo. Corrija erros gramaticais em grupos.

# Desenvolvimento

Este projeto utiliza a [Dicio API](https://github.com/ThiagoNelsi/dicio-api) criada pelo [ThiagoNelsi](https://github.com/ThiagoNelsi) como a fonte do dicionário. O bot está hospedado no [Replit](https://replit.com) e as informações do usuário são armazenadas em um banco de dados usando o [Supabase](https://supabase.com). A biblioteca [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) também foi utilizada para facilitar a interação com a API do Telegram. Por último, o site de apresentação do bot usa [Tailwind CSS](https://tailwindcss.com).

# Variáveis de ​Ambiente (.env)

```env
TG_TOKEN=Token que o @BotFather informa ao criar bot
SUPABASE_TOKEN=Anon
OWNER_ID=ID do Telegram do dono do bot
NEWS_PASSWORD=Senha para acessar criador de notícias
BOT_USERNAME=Username do bot
API_PROVIDER_URL=URL do provedor do dicionário (significado.herokuapp.com)
```

# Atualizações

Você pode ver as notas de atualização no [site do bot](https://dicionariobot.enzon19.com/novidades).