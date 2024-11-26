const db = require('./db/connection')


const fetchArticlesById = (article_id) => {
    return db
      .query(
        'SELECT author, title, article_id, body, topic, votes, created_at, article_img_url FROM articles WHERE article_id = $1;',
        [article_id]
      )
      .then((result) => result.rows[0]);
  };

  const fetchArticles = (sort_by = "created_at", order = "DESC") => {
    const validSortBy = ["author", "title", "article_id", "topic", "created_at", "votes"];
    const validOrder = ["ASC", "DESC"];
  
    if (!validSortBy.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }
  
    if (!validOrder.includes(order.toUpperCase())) {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  
    const sqlQuery = `
      SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order.toUpperCase()};
    `;
  
    return db.query(sqlQuery).then(({ rows }) => rows);
  };

  const fetchArticleComments = (article_id) => {
  
    const sqlQuery = `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
    `;
  
    return db.query(sqlQuery, [article_id])
      .then(({ rows }) => {
        return rows;
      })
      .catch((err) => {
        console.error("Database error when fetching comments: ", err);
        throw err;
      });
  };

 module.exports = { fetchArticlesById, fetchArticles, fetchArticleComments } 