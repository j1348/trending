import { getRepo, getReposFast, getReposFilter } from './repo';

export default {
    Query: {
        getRepos: getReposFast,
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
