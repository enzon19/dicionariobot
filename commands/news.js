function allData (db, bot) {

  db.getAll().then(keys => bot.sendMessage(1097090528, JSON.stringify(keys)));

}

async function addData (db, args, bot, message) {

  if (message.chat.id == 1097090528) db.set(args, 1).then(() => bot.sendMessage(1097090528, "Adicionado. " + args));

}

function deleteData (db, args, bot, message) {

  if (message.chat.id == 1097090528) db.delete(args).then(() => bot.sendMessage(1097090528, "Deletado. " + args));

}

function subscribe (db, command, message, bot) {

  const subStg = ["/sem_interesse", "/com_interesse"].indexOf(command);
  
  db.set(message.chat.id, subStg).then(() => bot.sendMessage(message.chat.id, `<b>Novidades</b> (Obrigatório)\nAs novidades do bot são novos recursos e mudanças feitas, ou seja, atualizações do bot. Inclui apenas novidades do bot utilizado (Dicionário Bot).\n\n<b>Divulgação de Bots</b> (${["Desativado", "Ativado"][subStg]})\nÉ divulgado apenas bots desenvolvidos pela Bolha. Inclui propagandas e novidades de outros bots da mesma. Pode ser que você encontre mais bots úteis pra você.\n\n<b>Anúncios</b> (${["Desativado", "Ativado"][subStg]})
Qualquer anunciante que quiser anunciar na plataforma de bots da Bolha. Você apoia o desenvolvimento do bot ativando isto.\n\n<b>Para ${["ativar", "desativar"][subStg]} estas notícias e anúncios, use ${["/com_interesse", "/sem_interesse"][subStg]}</b>`, {parse_mode: "HTML"}))

}

function draft (type, text, photo, tgOptions, bot, db, res) {

  res.send("Rascunho começou a ser executado.");

  if (photo) {

    bot.sendPhoto(1097090528, photo, {parse_mode: "HTML", caption: `<b>⚠ Enviado como ${["notícias", "divulgação de Bot", "anúncio"][type]}.</b>\n\n` + text.replace(/\\n/g, "\n"), ...JSON.parse(tgOptions)});

  } else {

    bot.sendMessage(1097090528, `<b>⚠ Enviado como ${["notícias", "divulgação de Bot", "anúncio"][type]}.</b>\n\n` + text.replace(/\\n/g, "\n"), {...{parse_mode: "HTML"}, ...JSON.parse(tgOptions)});

  }

}

async function publish (type, text, photo, tgOptions, bot, db, res) {

  res.send("Publicação começou a ser executado.");
  
  // 0 - DESATIVADO 
  // 1 - ATIVADO

  const allDB = await db.getAll();
  let allUsers = Object.entries(allDB).filter(e => !e[0].startsWith("shortcut_"));
  if (type != 0) allUsers = allUsers.filter(e => e[1] == 1);
  allUsers = allUsers.map(e => e[0]);
  
  for (let i = 0; i < allUsers.length; i++) {

    if (photo) {

      await bot.sendPhoto(allUsers[i], photo, {parse_mode: "HTML", caption: text.replace(/\\n/g, "\n"), ...JSON.parse(tgOptions)});

    } else {

      await bot.sendMessage(allUsers[i], text.replace(/\\n/g, "\n"), {...{parse_mode: "HTML"}, ...JSON.parse(tgOptions)});

    }

  }

}

module.exports = {allData, addData, deleteData, subscribe, draft, publish}