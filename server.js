const app = require('express')();
const requireFromString = require("require-from-string");
const fs = require('fs');
let db, botReference;

app.get('/', (req, res) => { 

  if (req.query.newspassword == process.env.PASSWORD) {

    res.sendFile(__dirname + '/web/news.html');

  } else {
  
    res.sendFile(__dirname + '/web/status.html');

  }

});

app.use(require('body-parser').urlencoded({ extended: false }));
app.post('*', (req, res) => {

  if (req.query.password == process.env.PASSWORD && req.query.type && req.query.sentType && req.body.text) {

    const news = requireFromString(fs.readFileSync("./commands/news.js","utf8"));
    [news.draft, news.publish][parseInt(req.query.sentType)](req.query.type, req.body.text, req.body.photo, req.body.tgOptions, botReference, db, res);

  }

});

module.exports = (bot, dicionarioDB) => {

  botReference = bot;
  db = dicionarioDB;
  app.listen(3000, () => console.log("O servidor está supimpamente bem."));

}