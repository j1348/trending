import { getRepo, getReposFast } from './repo';

export default {
    Query: {
        getRepos: getReposFast,
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
