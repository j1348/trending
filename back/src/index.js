const express = require('express');
const app = express();
const trending = require('trending-github');
const memoizee = require('memoizee');

const memoTrending = memoizee(trending, { async: true, maxAge: 5 * 60 * 1000 });

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/trending', function(req, res) {
    memoTrending().then(repos => {
        res.setHeader('Cache-Control', 'public, max-age=60000');
        res.send(repos);
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
