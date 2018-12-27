import { getRepo, getReposFast } from './repo';

export default {
    Query: {
        getRepos: (_, params) => getReposFast(params),
        getRepo: (_, { id }) => getRepo(id),
    },
};
