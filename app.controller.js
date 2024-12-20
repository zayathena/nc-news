const endpointsJson = require('./endpoints.json');
const db = require('./db/connection')
const { fetchArticlesById, fetchArticles, fetchArticleComments, insertComment, updateArticleVotes } = require('./app.model')

function getAPI (req, res, next) {
    res.status(200).send({ endpoints: endpointsJson })
    .catch((err) => {
      next(err)
    })
  };

function getTopics (req, res, next) {
    db.query('SELECT * FROM topics', (err, result) => {
        if (err) {
          return next(err);
        }
        const topics = result.rows || [];
        res.status(200).send({ topics });
      })
    };

function getArticlesById(req, res, next) {
        const { article_id } = req.params;
      
    
        if (isNaN(article_id)) {
          return next({ status: 400, msg: 'Invalid article ID' });
        }
      
        fetchArticlesById(article_id)
          .then((article) => {
            if (!article) {
              return next({ status: 404, msg: 'Article not found' });
            }
            res.status(200).send({ article });
          }).catch(next)
        };

function getArticles(req, res, next) {
          const { sort_by, order } = req.query;
        
          fetchArticles(sort_by, order)
            .then((articles) => {
              res.status(200).send({ articles });
            })
            .catch(next);
        }  

function getArticleComments(req, res, next) {
          const { article_id } = req.params;
          
          if (isNaN(article_id)) {
            return res.status(400).send({ msg: "Invalid article_id" });
          }
          
          fetchArticleComments(article_id)
            .then((comments) => {
              if (comments.length === 0) {
                return res.status(404).send({ msg: "No comments found for this article" });
              }
              res.status(200).send(comments);
            }).catch((err) => {
              console.error("Error fetching comments: ", err);
              next(err);
            });
        }

        function postArticleComment(req, res, next) {
          const article_id = Number(req.params.article_id);
          const { username, body } = req.body;
      
          if (!username || !body) {
              return res.status(400).send({ msg: "Bad request: Missing required fields" });
          }
      
          if (isNaN(article_id)) {
              return res.status(400).send({ msg: "Invalid article_id" });
          }
      
          fetchArticlesById(article_id)
              .then((article) => {
                  if (!article) {
                      throw { status: 404, msg: "Article does not exist" };
                  }
      
                  return db.query("SELECT username FROM users WHERE username = $1;", [username]);
              })
              .then(({ rows }) => {
                  if (rows.length === 0) {
                      throw { status: 404, msg: "User does not exist" };
                  }
      
                  return insertComment(article_id, username, body);
              })
              .then((comment) => {
                  res.status(201).send({ comment });
              })
              .catch((err) => {
                  next(err);
              });
      }
function patchArticleVotes(req, res, next) {
              const { article_id } = req.params;
              const { inc_votes } = req.body;
            
              if (!inc_votes || typeof inc_votes !== 'number') {
                return res.status(400).send({ msg: "Bad request: 'inc_votes' must be a number" });
              }
            
              updateArticleVotes(article_id, inc_votes)
                .then((updatedArticle) => {
                  if (!updatedArticle) {
                    return res.status(404).send({ msg: "Article not found" });
                  }
                  res.status(200).send({ article: updatedArticle });
                })
                .catch((err) => {
                  if (err.code === '22P02') { 
                    return res.status(400).send({ msg: 'Bad request: Invalid article_id' });
                  }
                  next(err);
                });
            }            

module.exports = { getAPI, getTopics, getArticlesById, getArticles, getArticleComments, postArticleComment, patchArticleVotes };