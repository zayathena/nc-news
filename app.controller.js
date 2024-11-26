const endpointsJson = require('./endpoints.json');
const db = require('./db/connection')
const { fetchArticlesById, fetchArticles } = require('./app.model')

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
      
module.exports = { getAPI, getTopics, getArticlesById, getArticles };