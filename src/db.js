const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/trending');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    // we're connected!
});

module.exports = db;
