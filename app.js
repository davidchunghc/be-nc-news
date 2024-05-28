const express = require("express");
const { getApi, getTopics } = require("./controllers/api.controllers");

const app = express();

app.get("/api/healthcheck", getApi);
app.get("/api/topics", getTopics);

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
