const express = require('express');
const app = express();
const moment = require('moment');
const db = require('./db');
const bodyParser = require('body-parser');

const importer = require('./importer');

const Trending = require('./trending');
const Repo = require('./repo');

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
            sort:{
                updatedAt: -1,
                createdAt: -1
            }
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
    const yesterday = moment()
        .subtract(1, 'day')
        .toDate();

    Repo.find(
        {
            'ticks.date': {
                $gte: yesterday,
            },
        },
        '',
        {
            sort:{
                updatedAt: -1,
                createdAt: -1
            }
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

app.listen(process.env.PORT || 3000, function() {
	console.log(`listening on port ${process.env.PORT || 3000}`);
});
