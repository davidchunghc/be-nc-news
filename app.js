const express = require("express");
const {
  getHealthcheck,
  getTopics,
  getApi,
  getArticleById,
  getArticles, // Task 5 & 11
  getCommentsByArticleId,
  addComment,
  deleteComment,
  patchArticleVotes,
  getUsers,
} = require("./controllers/api.controllers");

const app = express();
app.use(express.json());

app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/", getArticles); // Task 5 & 11
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", addComment);
app.patch("/api/articles/:article_id", patchArticleVotes); // Task 8
app.delete("/api/comments/:comment_id", deleteComment); // Task 9
app.get("/api/users", getUsers); // Task 10

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
