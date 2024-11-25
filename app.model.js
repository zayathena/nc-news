const db = require('./db/connection')


const fetchArticlesById = (article_id) => {
    return db
      .query(
        'SELECT author, title, article_id, body, topic, votes, created_at, article_img_url FROM articles WHERE article_id = $1;',
        [article_id]
      )
      .then((result) => result.rows[0]);
  };

 module.exports = { fetchArticlesById } 