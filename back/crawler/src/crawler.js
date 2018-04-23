const CronJob = require('cron').CronJob;
const Trending = require('./trending');
const trending = require('trending-github');

function updateTrending() {
	trending().then(repos => {
		console.log(new Date());
		console.log('crawling trending... ' + repos.length);

		var trending = new Trending({ repos });
		trending.save().catch(err => {
			console.error(err);
		});
	});
}

module.exports = new CronJob({
	cronTime: '*/2 * * * *',
	onTick: updateTrending,
	start: true,
	timeZone: 'Europe/Paris',
});
