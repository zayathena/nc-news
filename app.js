const express = require("express");
const app = express();
const { getAPI, getTopics, getArticlesById, getArticles } = require("./app.controller");

app.get('/api', getAPI);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles', getArticles);

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.error(err);
      res.status(500).send({ msg: 'Internal Server Error' });
    }
  });

module.exports = app;