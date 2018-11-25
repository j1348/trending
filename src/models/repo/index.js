import moment from 'moment';
import pMemoize from 'p-memoize';

import Repo from '../schema';

function getReposInternal(hour) {
    return Repo.find({
        'ticks.date': {
            $gte: moment()
                .subtract(hour || 240, 'hour')
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
                ticks: ticks.slice(Math.max(ticks.length - 40, 0)),
                stars,
                forks,
            };
        },
    );
}
