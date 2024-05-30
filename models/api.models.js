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
  // extra work that Hannah said can be removed, but I want to keep it in case I will need it again
  // const validSortBy = ["created_at"];
  // const validOrder = ["ASC", "DESC"];

  // if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
  //   return Promise.reject({ status: 400, msg: "Invalid query" });
  // }

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


exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      return result.rowCount > 0;
    });
};

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

