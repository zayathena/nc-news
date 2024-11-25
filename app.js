const express = require("express");
const app = express();
const { getAPI, getTopics } = require("./app.controller");

app.get('/api', getAPI);

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
});

module.exports = app;