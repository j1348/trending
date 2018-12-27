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

// repoSchema.index({ 'ticks.date': 1 });

const Repo = mongoose.model('Repo', repoSchema);

const reporefSchema = mongoose.Schema({
    name: String,
});
const Reporef = mongoose.model('Reporef', reporefSchema);

function reduceRepo() {
    console.time('reduceRepos');
    function map() {
        var lastTicks = this.ticks.slice(Math.max(this.ticks.length - 40, 0));
        for (var i = 0; i < lastTicks.length; i++) {
            const t = lastTicks[i];
            t.name = this.name;
            t.dates = t.date ? [t.date.toISOString().slice(0, 10)] : null;
            //   t.id = this._id;
            //   t.href = this.href;
            //   t.language = this.language;

            // eslint-disable-next-line no-undef
            emit(this._id, t);
        }
    }

    function reduce(id, ticks) {
        if (!ticks || ticks.length < 2) {
            return null;
        }

        const maxIndex = ticks.length - 1;
        const stars = ticks[maxIndex].stars;
        const name = ticks[maxIndex].name; // only to be query
        const speed = {};
        const dates = [];

        const stringDate = ticks[maxIndex].date.toISOString();
        const date = stringDate.slice(0, 10);

        // if (ticks.length === 1) {
        //     dates.push(date);
        //     return {
        //         name,
        //         date,
        //         dates,
        //         ticks,
        //         stars,
        //         speed,
        //     };
        // }

        for (var i = 0, ii = 1; i < maxIndex; i++, ii++) {
            if (!ticks[ii].date) {
                continue;
            }
            const stringDate = ticks[ii].date.toISOString();
            const date = stringDate.slice(0, 10);
            const hour = stringDate.slice(11, 16);
            const time =
                (new Date(ticks[ii].date).getTime() -
                    new Date(ticks[i].date).getTime()) /
                86400000; // 3600000 * 24);
            speed[date] = speed[date] || {};
            speed[date][hour] = Math.round(
                (ticks[ii].stars - ticks[i].stars) / time,
            );

            if (dates.indexOf(date) === -1) {
                dates.push(date);
            }
        }

        return {
            name,
            date,
            dates,
            stars,
            speed,
        };
    }

    Repo.mapReduce(
        {
            map: map.toString(),
            reduce: reduce.toString(),
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
