const mongoose = require('mongoose');

const trendingSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now,
    },
    repos: mongoose.Schema.Types.Mixed,
});

const Trending = mongoose.model('Trending', trendingSchema);

module.exports = Trending;
