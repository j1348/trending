import { getRepo, getRepos, getReposFilter } from './repo';

export default {
    Query: {
        getRepos,
        getReposFilter: (_, { filter }) => getReposFilter(filter),
        getRepo: (_, { id }) => getRepo(id),
    },
    Repo: {
        Ticks: ({ ticks }) => {
            return ticks.map(({ stars, forks, date }) => {
                return {
                    stars,
                    forks,
                    date,
                };
            });
        },
    },
};
