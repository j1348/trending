import { getRepos, getRepo, getReposFilter } from './repo';

export default {
    Query: {
        getRepos: (_, __, context) => getRepos(),
        getReposFilter: (_, { filter }, context) => getReposFilter(filter),
        getRepo: (_, { id }, context) => getRepo(id),
    },
    Repo: {
        Ticks: ({ ticks }, _, context) => {
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
