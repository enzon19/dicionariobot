const express = require("express");
const app = express();
const path = require('path');
const favicon = require('serve-favicon');

app.use(favicon(__dirname + '/front/static/favicon/favicon.ico'));

// Get static files
app.use('/static', express.static(path.join(__dirname + '/front/static')));
app.use('/css', express.static(path.join(__dirname + '/front/css')));
app.use('/js', express.static(path.join(__dirname + '/front/js')));

// Pages
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/front/html/index.html");
});

app.get('*', (req, res) => {
  let path = req.path;
  if (req.path == '/news' && req.query.newspassword != process.env.NEWS_PASSWORD) path = '';
  const filePath = __dirname + '/front/html' + path + '.html';

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(__dirname + "/front/html/404.html")
    }
  });
});

// Send messages using news.html
app.use(require("body-parser").urlencoded({ extended: false }));
app.post("*", (req, res) => {
  const sendType = req.body.type;
  const messageText = req.body.text;
  const messagePhoto = req.body.photo;
  const tgOptions = req.body.tgOptions.toString();

  if (sendType && (messageText || messagePhoto)) require('./core/news').sendNews(sendType, messageText, messagePhoto, tgOptions, res);
});

module.exports = () => {
  app.listen(2608, () => console.log("Dicionário Bot 3.0.0\n\nO servidor está supimpa."));
};
