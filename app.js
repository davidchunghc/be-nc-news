const express = require("express");
const {
  getHealthcheck,
  getTopics,
  getApi,
} = require("./controllers/api.controllers");

const app = express();

app.get("/api/healthcheck", getHealthcheck);
app.get("/api/topics", getTopics);
app.get("/api", getApi);

app.use((req, res, next) => {
  const err = new Error("Bad request");
  err.status = 400;
  next(err);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

module.exports = app;
