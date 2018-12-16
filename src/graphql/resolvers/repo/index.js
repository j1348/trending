import { Repo, Reporef } from './model';

import dayjs from 'dayjs';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import moment from 'moment';
import pMemoize from 'p-memoize';

function getReposInternal(hour) {
    return Repo.find({
        'ticks.date': {
            $gte: moment()
                .subtract(hour || 24, 'hour')
                .toDate(),
        },
    }).then(mapValues);
}

const memGetRepos = pMemoize(getReposInternal, { maxAge: 300000 });

export function getRepos(hour) {
    return memGetRepos(hour);
}

setInterval(function() {
    console.log('refreshing cache..');
    memGetRepos(24);
}, 60000);

export function getReposFilter(filter) {
    const query = {
        ...filter,
        'ticks.date': {
            $gte: moment()
                .subtract(24, 'hour')
                .toDate(),
        },
    };

    return Repo.find(query).then(mapValues);
}

export function getRepo(id) {
    return Repo.findOne({ _id: id }).then(repo => mapValues([repo])[0]);
}

export function getManyRepos(ids) {
    return Repo.find(
        { _id: { $in: ids } },
        'author name href language description stars',
    );
}

function starsByDay(ticks) {
    const minDate = ticks[0].date;
    const maxDate = ticks[ticks.length - 1].date;
    const maxStars = maxBy(ticks, t => t.stars).stars;
    const minStars = minBy(ticks, t => t.stars).stars;

    if (minDate === maxDate) {
        return 0;
    }
    return Math.round(
        (24 * 60 * (maxStars - minStars)) /
            dayjs(maxDate).diff(dayjs(minDate), 'minutes'),
        0,
    );
}

export function getRepoRefs() {
    return Reporef.find({}).sort({ 'value.date': -1, 'value.starsByDay': -1 });
}

function mapValues(repos) {
    return repos.map(
        ({
            _id: id,
            author,
            name,
            href,
            description,
            language,
            createdAt,
            updatedAt,
            ticks,
        }) => {
            const { stars, forks } = ticks[ticks.length - 1];
            return {
                id,
                author,
                name,
                href,
                description,
                language,
                createdAt,
                updatedAt,
                starsByDay: starsByDay(
                    ticks.slice(Math.max(ticks.length - 40, 0)),
                ),
                ticks,
                stars,
                forks,
            };
        },
    );
}
