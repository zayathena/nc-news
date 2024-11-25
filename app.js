const express = require("express");
const app = express();
const { getAPI, getTopics } = require("./app.controller");

app.get('/api', getAPI);

app.get('api/topics', getTopics)

module.exports = app;