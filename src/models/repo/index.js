import moment from 'moment';
import Repo from '../schema';

export function getRepos(hour) {
    return Repo.find({
        'ticks.date': {
            $gte: moment()
                .subtract(hour || 24, 'hour')
                .toDate(),
        },
    }).then(mapValues);
}

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
