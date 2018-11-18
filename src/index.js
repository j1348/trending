import express from 'express';
import cors from 'cors';
const app = express();
const moment = require('moment');
const db = require('./db');
const bodyParser = require('body-parser');

const importer = require('./importer');

const Trending = require('./trending');
const Repo = require('./models/schema');
const port = process.env.PORT || 3000;

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(bodyParser.json()); // for parsing application/json

app.use('/graphql', cors(), graphqlExpress({ schema, cacheControl: true }));
app.get('/docs', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});

import initRepo from './api/repo';
initRepo(app);

app.get('/importer', function(req, res) {
    res.send({ running: importer.running });
});

app.listen(port, function() {
    console.log(`listening on port ${port}`);
});
