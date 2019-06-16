const trending = require('trending-github');

trending().then(repos => {
    console.log(new Date());
    console.log('crawling trending... ' + repos.length);
});