const CronJob = require('cron').CronJob;
const async = require('async');
const omit = require('lodash.omit');

const Trending = require('./trending');
const Repo = require('./models/schema');

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
                            (tick.stars === tickToAdd.stars &&
                                tick.forks === tickToAdd.forks)
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

function importer(toProcessed = 10) {
    const startTime = new Date();
    Trending.find({})
        .then(trendings => {
            console.log(trendings.length);
            const partialTrendings = trendings.slice(
                0,
                Math.min(trendings.length, toProcessed),
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
                        },
                    );
                },
                function(err) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    Trending.deleteMany({ _id: { $in: idsToRemove } })
                        .then(() => {
                            const delay =
                                (new Date().getTime() - startTime.getTime()) /
                                1000;
                            console.log({
                                total: trendings.length,
                                processed: partialTrendings.length,
                                msg: `processed in ${delay}s`,
                            });
                        })
                        .catch(err => {
                            console.log(
                                'while removing ' + idsToRemove.join(', '),
                            );
                            console.error(err);
                        });
                },
            );
        })
        .catch(err => {
            console.error(err);
        });
}

module.exports = new CronJob({
    cronTime: '*/10 * * * *',
    onTick: importer,
    start: true,
    timeZone: 'Europe/Paris',
});
