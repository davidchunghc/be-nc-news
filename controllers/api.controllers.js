const { request } = require("../app");
const {
  getTopics,
  selectTopics,
  selectArticleById,
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
    const err = new Error("Bad request");
    err.status = 400;
    return next(err);
  }

  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        const err = new Error("Article not found");
        err.status = 404;
        return next(err);
      }
      response.status(200).send({ article });
    })
    .catch(next);
};
