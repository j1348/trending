import moment from 'moment';
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

const reporefSchema = mongoose.Schema({
    starsByDay: Number,
});

const Reporef = mongoose.model('Reporef', reporefSchema);

function reduceRepo() {
    console.time('reduceRepos');
    function map() {
        var lastTicks = this.ticks.slice(Math.max(this.ticks.length - 40, 0));
        for (var i = 0; i < lastTicks.length; i++) {
            const t = lastTicks[i];
            t.name = this.name;
            t.id = this._id;
            t.href = this.href;
            t.language = this.language;
            // eslint-disable-next-line no-undef
            emit(this._id, t);
        }
    }

    function reduce(id, ticks) {
        if (ticks.length < 2) {
            return 0;
        }

        var tick = ticks[0];
        var minStars = tick.stars;
        var maxStars = minStars;
        var minDate = tick.date;
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

        return {
            date: maxDate,
            stars: maxStars,
            starsByDay: Math.round(
                (24 * 1000 * 3600 * (maxStars - minStars)) /
                    (maxDate - minDate),
            ),
        };
    }

    Repo.mapReduce(
        {
            map: map.toString(),
            reduce: reduce.toString(),
            query: {
                'ticks.date': {
                    $gte: moment()
                        .subtract(24, 'hour')
                        .toDate(),
                },
            },
            out: { replace: 'reporefs', inline: 1 },
        },
        (err, result) => {
            if (err) {
                console.log(err);
            }

            console.timeEnd('reduceRepos');
            console.log(result.stats);
        },
    );
}

module.exports = {
    Repo,
    Reporef,
    reduceRepo,
};
