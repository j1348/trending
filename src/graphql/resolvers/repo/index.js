import { Repo, Reporef } from './model';

export function getManyRepos(ids) {
    return Repo.find(
        { _id: { $in: ids } },
        'author name href language description stars',
    );
}

export function getRepo(id) {
    return Repo.find({ _id: id }).map(
        ({ _id: id, name, author, language, href, description, ticks }) => {
            return {
                id,
                name,
                author,
                language,
                href,
                description,
                ticks,
            };
        },
    );
}

export function getRepoRefs(filter) {
    let query = {};
    if (filter) {
        if (filter.from || filter.to) {
            query = { 'value.dates': {} };
            if (filter.from) {
                query['value.dates']['$gte'] = filter.from;
            }
            if (filter.to) {
                query['value.dates']['$lte'] = filter.to;
            }
        } else if (filter.at) {
            query = { 'value.dates': filter.at };
        } else if (filter.name) {
            query = { 'value.name': filter.name };
        } else {
            query = { 'value.date': new Date().toISOString().slice(0, 10) };
        }
    }
    return Reporef.find(query);
}

function sortByDate(a, b) {
    if (a.date < b.date) {
        return 1;
    }

    if (a.date > b.date) {
        return -1;
    }

    return 0;
}

export function getReposFast(params) {
    return getRepoRefs(params).then(data => {
        const ids = data.map(d => d._id);
        const metaInfo = data.reduce((result, { _doc: { value }, _id }) => {
            result[_id] = value;
            return result;
        }, {});

        return getManyRepos(ids).then(repos => {
            const newRepos = repos.map(
                ({ _id: id, name, description, author, language, href }) => {
                    const { stars, date, dates, speed } = metaInfo[id];
                    return {
                        id,
                        name,
                        description,
                        author,
                        language,
                        href,
                        stars,
                        date,
                        dates,
                        speed,
                    };
                },
            );
            newRepos.sort(sortByDate);
            return newRepos;
        });
    });
}
