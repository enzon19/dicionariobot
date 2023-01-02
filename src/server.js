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
  const filePath = __dirname + '/front/html' + req.path + '.html';
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(__dirname + "/front/html/404.html")
    }
  });
});

// Send messages using news.html
app.use(require("body-parser").urlencoded({ extended: false }));
app.post("*", (req, res) => {
  // if (req.query.password == process.env.NEWS_PASSWORD && req.query.type && req.query.sentType && req.body.text) {
  //   const news = requireFromString(fs.readFileSync("./commands/news.js", "utf8"));
  //   [news.draft, news.publish][parseInt(req.query.sentType)](
  //     req.query.type,
  //     req.body.text,
  //     req.body.photo,
  //     req.body.tgOptions,
  //     botReference,
  //     db,
  //     res
  //   );
  // }
});

module.exports = () => {
  app.listen(2608, () => console.log("Dicionário Bot 3.0.0\n\nO servidor está supimpa."));
};
