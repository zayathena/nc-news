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

  const insertComment = (article_id, username, body) => {
    const sqlQuery = `
      INSERT INTO comments (article_id, author, body, votes, created_at)
      VALUES ($1, $2, $3, 0, NOW())
      RETURNING comment_id, article_id, author, body, votes, created_at;
    `;

    return db
        .query(sqlQuery, [article_id, username, body])
        .then(({ rows }) => {
            const insertedComment = rows[0];
            console.log("Inserted comment result:", insertedComment);
            return {
                comment_id: insertedComment.comment_id,
                article_id: insertedComment.article_id,
                username: insertedComment.author, // Map 'author' to 'username'
                body: insertedComment.body,
                votes: insertedComment.votes,
                created_at: insertedComment.created_at,
            };
        })
        .catch((err) => {
            console.error("Database error during comment insertion:", err.stack || err);
            throw err;
        });
};

  const updateArticleVotes = (article_id, inc_votes) => {
    const sqlQuery = `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `;
  
    return db.query(sqlQuery, [inc_votes, article_id]).then(({ rows }) => {
      return rows[0]; 
    });
  }

 module.exports = { fetchArticlesById, fetchArticles, fetchArticleComments, insertComment, updateArticleVotes } 