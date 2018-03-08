const express = require('express');
const app = express();
const db = require('./db');
const omit = require('lodash.omit');
const async = require('async');

const Trending = require('./trending');
const Repo = require('./repo');

const crawler = require('./crawler');

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
	console.log(r);

	return Repo.find({ href: r.href })
		.then(([repo]) => {
			if (!repo) {
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
				return a.date.getTime() < b.date.getTime();
			});

			return repo.save();
		})
		.catch(err => {
			console.error(err);
		});
}

app.get('/repos', function(req, res) {
	Repo.find({}, (err, repos) => {
		if (err) {
			console.error(err);
			return;
		}

		res.setHeader('Cache-Control', 'public, max-age=60000');
		res.send({ repos });
	});
});

function getMinDate() {
	const today = new Date();
	return new Date(Date.UTC(2018, today.getMonth() - 1, today.getDay()));
}

app.get('/merge', function(req, res) {
	Trending.find({ created: { $gte: getMinDate() } })
		.then(trendings => {
			async.eachSeries(
				trendings,
				function(trending, cb) {
					async.eachSeries(
						getRepoFromTrending(trending),
						function(repo, cb2) {
							mergeTrendingWithRepo(repo).then(() => {
								cb2(null, {});
							});
						},
						function(err) {
							cb(null, {});
						}
					);
				},
				function(err) {
					res.send({ msg: 'finished' });
				}
			);
		})
		.catch(err => {
			console.error(err);
			res.send({ err });
		});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
