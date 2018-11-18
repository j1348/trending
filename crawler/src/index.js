const express = require('express');
const app = express();
const db = require('./db');
const port = process.env.PORT || 3001;
const crawler = require('./crawler');

app.get('/', function(req, res) {
    res.send({ running: crawler.running });
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});
