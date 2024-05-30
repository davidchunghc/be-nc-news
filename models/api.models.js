const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT slug, description FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rows[0];
    });
};

exports.selectAllArticles = (sort_by = "created_at", order = "DESC") => {
  queryString = `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};
    `;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rowCount > 0;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `
      SELECT comment_id, votes, created_at, author, body, article_id
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
    `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body, votes, created_at)
       VALUES ($1, $2, $3, 0, NOW())
       RETURNING comment_id, votes, created_at, author, body, article_id;`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};



// Task 8 --- Start
exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
       SET votes = votes + $2
       WHERE article_id = $1
       RETURNING *;`,
      [article_id, inc_votes]
    )
    .then((result) => {
      return result.rows[0];
    });
};
// Task 8 --- End

// Task 9 --- Start
exports.removeComment = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};
// Task 9 --- End


// Task 10 --- Start
exports.selectUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then((result) => {
      return result.rows;
    });
};
// Task 10 --- End
