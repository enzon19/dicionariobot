<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/enzon19/dicionariobot/main/resources/Botpic.png" alt="Dicionário Bot" width="187" height="187">
  <br><br>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.pt-BR.md#20">
        <img height="20px" src="https://img.shields.io/badge/Vers%C3%A3o%20Atual-v2.1-ee2919">
    </a>
    <a href="https://github.com/enzon19/dicionariobot/blob/main/README.md">
        <img height="20px" src="https://img.shields.io/badge/EN-flag.svg?color=555555&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNjAgMzAiIGhlaWdodD0iNjAwIj4NCjxkZWZzPg0KPGNsaXBQYXRoIGlkPSJ0Ij4NCjxwYXRoIGQ9Im0zMCwxNWgzMHYxNXp2MTVoLTMwemgtMzB2LTE1enYtMTVoMzB6Ii8+DQo8L2NsaXBQYXRoPg0KPC9kZWZzPg0KPHBhdGggZmlsbD0iIzAwMjQ3ZCIgZD0ibTAsMHYzMGg2MHYtMzB6Ii8+DQo8cGF0aCBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNiIgZD0ibTAsMGw2MCwzMG0wLTMwbC02MCwzMCIvPg0KPHBhdGggc3Ryb2tlPSIjY2YxNDJiIiBzdHJva2Utd2lkdGg9IjQiIGQ9Im0wLDBsNjAsMzBtMC0zMGwtNjAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIvPg0KPHBhdGggc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjxwYXRoIHN0cm9rZT0iI2NmMTQyYiIgc3Ryb2tlLXdpZHRoPSI2IiBkPSJtMzAsMHYzMG0tMzAtMTVoNjAiLz4NCjwvc3ZnPg0K">
    </a>
    <a align="center" href="https://github.com/enzon19/dicionariobot/blob/main/README.pt-BR.md">
        <img height="20px" src="https://img.shields.io/badge/PT--BR-green">
    </a>
</p>

# Dicionário Bot

Um dicionário da língua portuguesa brasileira no Telegram. O Dicionário Bot funciona normalmente ou através do modo inline, ou seja, ao escrever @dicionariobot e pesquisar por uma palavra ou escrever uma frase. Se você cometer um erro, o bot talvez te corrija ou corrija outros membros de um grupo.

# Sobre o Desenvolvimento

A database vem da [Dicio API](https://github.com/ThiagoNelsi/dicio-api) feito pelo [ThiagoNelsi](https://github.com/ThiagoNelsi). O bot está hospedado no [Replit](https://replit.com), e os tokens de APIs estão salvos em arquivos .env no Replit.

---

# Atualizações
## 2.1
<details open>
<summary><b>Novidades e Mudanças</b></summary>
    • <b><i>NOVO!</i></b> Comando \exemplos. Veja frases exemplificando o uso de uma palavra.<br>
    • Escolha os exemplos como seu atalho padrão no chat privado com o bot.<br>
    • Gerencie os dados que o bot tem sobre você no comando de configurações (/settings). O bot guarda o seu ID do Telegram para recebimento de novidades e as suas configurações, <a href="https://telegra.ph/Pol%C3%ADtica-de-Privacidade-do-Dicion%C3%A1rio-Bot-09-16">saiba mais</a>.
</details>
<details open>
<summary><b>Correções de Bug</b></summary>
    • Palavras acentuadas agora podem ser encontradas no dicionário.<br>
    • Ainda sobre palavras acentuadas, palavras com grafia igual, mas acentuação diferente estavam recebendo os mesmos significados (como, por exemplo, metro e metrô).<br>
    • Clique do botão no modo inline ao não ter respostas agora funciona.<br>
    • Alguns textos e instruções foram modificados para se padronizarem.
</details>

## 2.0
<details close>
<summary><b>Novidades e Mudanças</b></summary>
    • <b><i>NOVO!</i></b> Agora é possível apenas enviar /definir ou /sinonimo e escrever uma palavra respondendo a mensagem do bot. Experimente, basta clicar: /definir. <br>• <b><i>NOVO!</i></b> Configure atalhos para definição ou sinônimos de uma palavra no chat privado. Por exemplo, você pode digitar /arroz no chat privado com o bot para receber a definição de arroz. Se preferir receber sinônimos, mude isto em /ajustes. <br>• <b><i>NOVO!</i></b> Comandos auxiliares como /settings e /help foram adicionados. <br>• A ordem dos comandos e a descrição de todos foram atualizadas. <br>• Ao invés de obter apenas um sinônimo da palavra informada, obtenha uma lista com todos. <br>• A política de privacidade foi atualizada.
</details>
<details close>
<summary><b>Correções de Bug</b></summary>
    • Os sinônimos estão de volta no modo inline.
</details>
