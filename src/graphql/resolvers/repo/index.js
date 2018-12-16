import { Repo, Reporef } from './model';

export function getManyRepos(ids) {
    return Repo.find(
        { _id: { $in: ids } },
        'author name href language description stars',
    );
}

export function getRepoRefs() {
    return Reporef.find({}).sort({ 'value.date': -1, 'value.starsByDay': -1 });
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
                ({ _id: id, name, author, language, href, description }) => {
                    const { stars, starsByDay, date } = metaInfo[id];
                    return {
                        id,
                        date,
                        author,
                        name,
                        description,
                        href,
                        language,
                        stars,
                        starsByDay,
                    };
                },
            );
            return newRepos;
        });
    });
}
