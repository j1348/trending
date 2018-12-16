import { getManyRepos, getRepoRefs } from './graphql/resolvers/repo';

import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';

const app = express();
require('./db');

const compression = require('compression');
const importer = require('./importer');

require('./trending');
require('./graphql/resolvers/repo/model');
const port = process.env.PORT || 3000;

const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    playground: {
        endpoint: `/graphql`,
        settings: {
            'editor.theme': 'light',
        },
    },
});

app.use(compression());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});

app.get('/importer', function(req, res) {
    res.send({ running: importer.running });
});

app.get('/reporefs', function(req, res) {
    getRepoRefs().then(data => {
        const ids = data.map(d => d._id);
        const metaInfo = data.reduce((result, { _doc: { value }, _id }) => {
            result[_id] = value;
            return result;
        }, {});

        getManyRepos(ids)
            .then(repos => {
                const newRepos = repos.map(
                    ({
                        _id: id,
                        name,
                        author,
                        language,
                        href,
                        description,
                    }) => {
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
                res.send(newRepos);
            })
            .catch(err => {
                res.send({ err });
            });
    });
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});

server.applyMiddleware({ app, path: '/graphql' });
