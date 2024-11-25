const endpointsJson = require('./endpoints.json');
const db = require('./db/connection')

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

module.exports = { getAPI, getTopics };