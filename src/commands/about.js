'use strict';

const bot = global.bot;
const botUsername = process.env.BOT_USERNAME;

function start (message) {
  const chatID = message.chat.id;
  const groupAdd = message.chat.type != 'private';
  
  const startText = `*Dicionário Bot \\(dicionariobot\\)*
Um dicionário da língua portuguesa brasileira no Telegram\\. 

Para começar envie /definir, /sinonimos ou /exemplos\\. Você também pode usar o modo inline ao digitar @${botUsername} no campo de mensagem em qualquer bate\\-papo e escrever alguma palavra\\. ${groupAdd ? 'Cometa um erro gramatical e o bot pode te corrigir\\. Essa função só funciona [com essa a lista de palavras](dicionariobot.enzon19.com/lista) e se o administrador do grupo permitir o bot ter acesso às mensagens\\.' : 'Quando adicionado em algum grupo, pode corrigir alguns erros gramaticais\\.'}

_Você pode ler a [política de privacidade informal](https://dicionariobot.enzon19.com/privacidade)\\, além de [ver o código\\-fonte do bot](https://github.com/enzon19/dicionariobot)\\._`;

  bot.sendMessage(chatID, startText, {
    parse_mode: 'MarkdownV2',
    reply_to_message_id: message.message_id,
    disable_web_page_preview: true, 
    reply_markup: {
      inline_keyboard: 
      [[{text: 'Usar modo inline', switch_inline_query: ''}]]
    }
  });
}

function about (message) {
  const chatID = message.chat.id;
  const aboutText = `*Versão:* 3\\.0\\.0 \\| [Notas de atualização](https://dicionariobot.enzon19.com/novidades)
*Desenvolvedor:* @enzon19 \\| [Site](https://enzon19.com) \\| [GitHub](https://github.com/enzon19)`;

  bot.sendMessage(chatID, aboutText, {
    parse_mode: 'MarkdownV2',
    reply_to_message_id: message.message_id,
    disable_web_page_preview: true
  });
}

function privacy (message) {
  const chatID = message.chat.id;
  const privacyText = `• Veja a [política de privacidade](https://dicionariobot.enzon19.com/privacidade)\\.
• Confira o código do bot no [GitHub](https://github.com/enzon19/dicionariobot)\\.
• Gerencie os dados que o bot tem sobre você no comando de configurações \\(/settings\\)\\.`;

  bot.sendMessage(chatID, privacyText, {
    parse_mode: 'MarkdownV2',
    reply_to_message_id: message.message_id,
    disable_web_page_preview: true
  });
}

module.exports = {start, about, privacy}