'use strict';
const database = global.database;

async function getUsersIDs () {
  const data = (await database.from('users').select('id')).data;
  return data.map(user => user.id);
}

async function sendNews (sendType, messageText, messagePhoto, tgOptions, res) {
  res.send(`${sendType} começou a ser executado.`);
  const usersToSend = sendType == 'Rascunho' ? [process.env.OWNER_ID] : await getUsersIDs();

  console.log(`\n---- Enviando notícias (${sendType}) ----\n`);
  let usersToRemove = [];
  
  for (let i = 0; i < usersToSend.length; i++) {
    const currentUser = usersToSend[i];
    try {
      if (messagePhoto) {
        await bot.sendPhoto(currentUser, messagePhoto, {
          parse_mode: 'HTML',
          caption: mdToHTML(messageText),
          ...JSON.parse(tgOptions),
        });
      } else {
        await bot.sendMessage(currentUser, mdToHTML(messageText), {
          parse_mode: 'HTML', 
          ...JSON.parse(tgOptions) 
        });
      }
    } catch (error) {
      console.log('Eita. - ' + i + ' - ' + currentUser + ' - ' + error);
      usersToRemove.push(currentUser);
    }
  }

  console.log('\n' + JSON.stringify(usersToRemove));
}

function mdToHTML (text) {
  return text.replace(/&/g, '&amp;')
  .replace(/>/g, '&gt;')
  .replace(/</g, '&lt;')
  .replace(/_([^_]+)_/g, '<em>$1</em>')
  .replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="tg-link" href="$2">$1</a>');
}

module.exports = {sendNews}