import { Repo, Reporef } from './model';

export function getManyRepos(ids) {
    return Repo.find(
        { _id: { $in: ids } },
        'author name href language description stars',
    );
}

export function getRepoRefs() {
    return Reporef.find({});
}

export function getRepo(id) {
    return Repo.find({ _id: id }).map(
        ({ _id: id, name, author, language, href, description }) => {
            return {
                id,
                name,
                author,
                language,
                href,
                description,
            };
        },
    );
}

export function getReposFast() {
    return getRepoRefs().then(data => {
        const ids = data.map(d => d._id);
        const metaInfo = data.reduce((result, { _doc: { value }, _id }) => {
            result[_id] = value;
            return result;
        }, {});

        return getManyRepos(ids).then(repos => {
            const newRepos = repos.map(
                ({ _id: id, name, description, author, language, href }) => {
                    const { date, stars, starsByDay } = metaInfo[id];
                    return {
                        id,
                        name,
                        description,
                        author,
                        language,
                        href,
                        date,
                        stars,
                        starsByDay,
                    };
                },
            );
            return newRepos;
        });
    });
}
