const { request } = require("../app");
const {
  getTopics,
  selectTopics,
  selectArticleById,
  selectAllArticles,
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

// extra work that Hannah said can be removed
// exports.getArticles = (request, response, next) => {
//   const { sort_by, order } = request.query;

//   selectAllArticles(sort_by, order)
//     .then((articles) => {
//       response.status(200).send({ articles });
//     })
//     .catch(next);
// };
