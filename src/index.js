import express from 'express';
// import cors from 'cors';
const app = express();
require('./db');

const importer = require('./importer');

require('./trending');
require('./models/schema');
const port = process.env.PORT || 3000;

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

import { ApolloServer } from 'apollo-server-express';

const server = new ApolloServer({
    cors: true,
    typeDefs,
    resolvers,
    debug: true,
    playground: {
        endpoint: `/graphql`,
        settings: {
            'editor.theme': 'light',
        },
    },
});

// app.use('/graphql', cors()); // for parsing application/json

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

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});

server.applyMiddleware({ app, path: '/graphql' });
