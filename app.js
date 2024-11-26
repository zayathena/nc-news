const express = require("express");
const app = express();
const { getAPI, getTopics, getArticlesById, getArticles, getArticleComments } = require("./app.controller");

app.use(express.json());

app.get('/api', getAPI);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

module.exports = app;