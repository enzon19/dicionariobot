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
          parse_mode: 'Markdown',
          caption: messageText,
          ...JSON.parse(tgOptions),
        });
      } else {
        await bot.sendMessage(currentUser, messageText, {
          parse_mode: 'Markdown', 
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

module.exports = {sendNews}