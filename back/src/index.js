const express = require('express');
const app = express();
const moment = require('moment');
const db = require('./db');
const bodyParser = require('body-parser');

const importer = require('./importer');

const Trending = require('./trending');
const Repo = require('./repo');
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // for parsing application/json

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// db.repos.find({ 'ticks.date': { $gte: new Date(2018, 2, 20) }  });

app.get('/repos', function(req, res) {
    const yesterday = moment()
        .subtract(1, 'day')
        .toDate();

    Repo.find(
        {
            'ticks.date': {
                $gte: yesterday,
            },
        },
        '-ticks',
        {
            sort: {
                updatedAt: -1,
                createdAt: -1,
            },
        },
        (err, repos) => {
            if (err) {
                console.error(err);
                return;
            }

            res.setHeader('Cache-Control', 'public, max-age=5000');
            res.send({ repos });
        }
    );
});

app.get('/fullrepos', function(req, res) {
    const { hour } = req.query;

    Repo.find(
        {
            'ticks.date': {
                $gte: moment()
                    .subtract(hour || 24, 'hour')
                    .toDate(),
            },
        },
        '',
        {
            sort: {
                updatedAt: -1,
                createdAt: -1,
            },
        },
        (err, repos) => {
            if (err) {
                console.error(err);
                return;
            }

            const newRepos = repos.map(
                ({ _id, author, name, href, description, language, createdAt, updatedAt, ticks }) => {
                    const { stars, forks } = ticks[ticks.length - 1];
                    return {
                        _id,
                        author,
                        name,
                        href,
                        description,
                        language,
                        createdAt,
                        updatedAt,
                        stars,
                        forks,
                    };
                }
            );

            res.setHeader('Cache-Control', 'public, max-age=5000');
            res.send({ repos: newRepos });
        }
    );
});

app.get('/repos/:id', function(req, res) {
    const { id } = req.params;

    Repo.findOne(
        {
            _id: id
        },
        (err, repos) => {
            if (err) {
                console.error(err);
                return;
            }

            res.setHeader('Cache-Control', 'public, max-age=5000');
            res.send({ repos });
        }
    );
});

app.get('/importer', function(req, res) {
    res.send({ running: importer.running });
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});
