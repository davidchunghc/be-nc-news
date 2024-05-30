const { request } = require("../app");
const {
  getTopics,
  selectTopics,
  selectArticleById,
  selectAllArticles,
  checkArticleExists,

  updateArticleVotes,

  insertComment,
  selectCommentsByArticleId,



} = require("../models/api.models");
const endpoints = require("../endpoints.json");

exports.getHealthcheck = (request, response) => {
  response.status(200).send();
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};

exports.getApi = (request, response, next) => {
  request.status(200).send(endpoints);
};

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
  }

  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (request, response, next) => {
  selectAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
  }

  checkArticleExists(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.addComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" }).catch(next);
  }

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields",
    }).catch(next);
  }

  checkArticleExists(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return insertComment(article_id, username, body);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};


exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (isNaN(article_id) || typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Bad request" });
  }

  checkArticleExists(article_id)
    .then((exists) => {
      if (!exists) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};


// extra work that Hannah said can be removed


// extra work that Hannah said can be removed, but I want to keep it in case I will need it again

// exports.getArticles = (request, response, next) => {
//   const { sort_by, order } = request.query;

//   selectAllArticles(sort_by, order)
//     .then((articles) => {
//       response.status(200).send({ articles });
//     })
//     .catch(next);
// };

