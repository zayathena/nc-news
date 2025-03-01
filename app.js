const express = require("express");
const app = express();
const cors = require('cors');
const { getAPI, getTopics, getArticlesById, getArticles, getArticleComments, postArticleComment, patchArticleVotes } = require("./app.controller");

app.use(express.json());
app.use(cors());

app.get('/api', getAPI);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postArticleComment)
app.patch('/api/articles/:article_id', patchArticleVotes)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

module.exports = app;