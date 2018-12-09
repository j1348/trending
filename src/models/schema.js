import mongoose from 'mongoose';

const repoSchema = mongoose.Schema(
    {
        author: {
            type: String,
            required: true,
        },
        name: String,
        description: String,
        href: {
            type: String,
            index: true,
            unique: true,
        },
        language: String,
        ticks: [
            {
                stars: Number,
                forks: Number,
                date: Date,
            },
        ],
    },
    { timestamps: true },
);

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
    return this.toString();
};

repoSchema.index({ 'ticks.date': 1 });

const Repo = mongoose.model('Repo', repoSchema);

function map() {
    var lastTicks = this.ticks.slice(Math.max(this.ticks.length - 40, 0));
    for (var i = 0; i < lastTicks.length; i++) {
        emit(this.name, lastTicks[i]);
    }
}

function reduce(id, ticks) {
    if (!ticks.length) {
        return 0;
    }

    var minStars = ticks[0].stars;
    var maxStars = minStars;
    var minDate = ticks[0].date;
    var maxDate = ticks[ticks.length - 1].date;
    var tmp = minStars;

    for (var i = 1; i < ticks.length; i++) {
        tmp = ticks[i].stars;
        if (tmp > maxStars) {
            maxStars = tmp;
        } else if (tmp < minStars) {
            minStars = tmp;
        }
    }

    return Math.round(
        (24 * 1000 * 3600 * (maxStars - minStars)) / (maxDate - minDate),
    );
}

Repo.mapReduce(
    {
        map: map.toString(),
        reduce: reduce.toString(),
        out: { replace: 'starsByDay' },
    },
    (err, results) => {
        console.log(err);
        console.log(results);
    },
);

module.exports = Repo;
