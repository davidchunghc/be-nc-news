const express = require("express");
const {
  getHealthcheck,
  getTopics,
  getApi,
  getArticleById,
} = require("./controllers/api.controllers");

const app = express();

app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
