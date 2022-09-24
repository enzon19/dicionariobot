const express = require("express");
const app = express();
const path = require('path');

const requireFromString = require("require-from-string");
const fs = require("fs");
const motherFolder = __dirname.slice(0, -2);

// Get static files
app.use('/front', express.static(path.join(motherFolder + "/front")));

// Get index.html or response with news.html if the password is right
app.get("/", (req, res) => {
  if (req.query.newsPassword == process.env.NEWS_PASSWORD) {
    res.sendFile(motherFolder + "/front/html/news.html");
  } else {
    res.sendFile(motherFolder + "/front/html/index.html");
  }
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
