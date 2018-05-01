import { getRepos, getRepo } from './repo';

export default {
    Query: {
        getRepos: (_, __, context) => {
            return getRepos();
        },
        getRepo: (_, { id }, context) => {
            return getRepo(id);
        },
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
