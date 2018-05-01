import moment from 'moment';
import Repo from '../schema';

const sort = {
    updatedAt: -1,
    createdAt: -1,
};

export function getRepos(hour) {
    return Repo.find(
        {
            'ticks.date': {
                $gte: moment()
                    .subtract(hour || 24, 'hour')
                    .toDate(),
            },
        },
        '',
        {
            sort,
        },
    ).then(mapValues);
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
                ticks,
                stars,
                forks,
            };
        },
    );
}
