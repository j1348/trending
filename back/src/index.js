const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const omit = require('lodash.omit');
const async = require('async');

const Trending = require('./trending');
const Repo = require('./repo');

const crawler = require('./crawler');

app.use(bodyParser.json()); // for parsing application/json

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

function getRepoFromTrending({ repos, created }) {
	return repos.map(repo => {
		const { stars, forks } = repo;
		repo.ticks = [
			{
				date: created,
				stars,
				forks,
			},
		];
		return omit(repo, 'stars', 'forks');
	});
}

function mergeTrendingWithRepo(r) {
	return Repo.find({ href: r.href })
		.then(([repo]) => {
			if (!repo) {
				console.log(`create new repo ${r.href}`);
				return new Repo(r).save();
			}

			var tmp = r.ticks.reduce((newTicks, tickToAdd) => {
				if (
					!repo.ticks.some(tick => {
						return (
							tick.date.getTime() === tickToAdd.date.getTime() ||
							(tick.stars === tickToAdd.stars && tick.forks === tickToAdd.forks)
						);
					})
				) {
					newTicks.push(tickToAdd);
				}

				return newTicks;
			}, []);

			repo.ticks = repo.ticks.concat(tmp);
			repo.ticks.sort((a, b) => {
				return a.date.getTime() - b.date.getTime();
			});

			console.log(`update repo ${r.href}`);
			return repo.save();
		})
		.catch(err => {
			console.error(err);
		});
}

app.get('/repos', function(req, res) {
	console.log(req.query);
	Repo.find(req.query || {}, (err, repos) => {
		if (err) {
			console.error(err);
			return;
		}

		res.setHeader('Cache-Control', 'public, max-age=5000');
		res.send({ repos });
	});
});

// function getMinDate() {
// 	const today = new Date();
// 	return new Date(Date.UTC(2018, today.getMonth() - 1, today.getDay()));
// }

function removeTrendings(idsToRemove) {
	return Trending.remove({ _id: { $in: idsToRemove } });
}

app.get('/import', function(req, res) {
	const { n: toProcessed } = req.query;
	const startTime = new Date();
	Trending.find({})
		.then(trendings => {
			console.log(trendings.length);
			const partialTrendings = trendings.slice(
				0,
				Math.min(trendings.length, toProcessed || 10)
			);
			console.log(partialTrendings.length);

			const idsToRemove = [];

			async.eachSeries(
				partialTrendings,
				function(trending, cb) {
					const { id } = trending;
					idsToRemove.push(id);
					async.eachSeries(
						getRepoFromTrending(trending),
						function(repo, cb2) {
							mergeTrendingWithRepo(repo).then(() => {
								cb2(null, {});
							});
						},
						function(err) {
							cb(err, {});
						}
					);
				},
				function(err) {
					if (err) {
						res.status(500).json({ err });
						return;
					}

					removeTrendings(idsToRemove)
						.then(() => {
							const delay = (new Date().getTime() - startTime.getTime()) / 1000;
							res.send({
								total: trendings.length,
								processed: partialTrendings.length,
								msg: `processed in ${delay}s`,
							});
						})
						.catch(err => {
							res.status(500).json({ err });
						});
				}
			);
		})
		.catch(err => {
			console.error(err);
			res.send({ err });
		});
});

app.get('/trending', function(req, res) {
	const startTime = new Date();
	Trending.find({})
		.then(trendings => {
			res.send({ trendings: trendings.slice(Math.max(trendings.length - 10, 1)) });
		})
		.catch(err => {
			console.error(err);
			res.send({ err });
		});
});

app.listen(process.env.PORT || 3000, function() {
	console.log(`listening on port ${process.env.PORT || 3000}`);
});
