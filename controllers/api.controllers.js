const { request } = require("../app");
const { getTopics, selectTopics } = require("../models/api.models");

exports.getApi = (request, response) => {
  response.status(200).send();
};

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch(next);
};
