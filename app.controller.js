const endpointsJson = require('./endpoints.json');
const db = require('./db/connection')
const { fetchArticlesById } = require('./app.model')

function getAPI (req, res, next) {
    res.status(200).send({ endpoints: endpointsJson })
    .catch(next)
};

function getTopics (req, res, next) {
    db.query('SELECT * FROM topics', (err, result) => {
        if (err) {
          return next(err);
        }
        const topics = result.rows || [];
        res.status(200).send({ topics });
      });
    }

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
          })
          .catch(next);
      }

      
module.exports = { getAPI, getTopics, getArticlesById };