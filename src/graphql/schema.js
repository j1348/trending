// eslint-disable-next-line no-unused-vars
import GraphQLJSON from 'graphql-type-json';
import { gql } from 'apollo-server-express';

export default gql`
    scalar JSON
    scalar Date

    type Tick {
        stars: Int!
        forks: Int!
        date: Date!
    }

    type Repo {
        id: ID!
        author: String!
        name: String!
        language: String!
        description: String
        starsByDay: Int
        href: String!
        Ticks: [Tick]
        stars: Int!
        forks: Int!
        date: Date
        createdAt: Date!
        updatedAt: Date!
    }

    type Query {
        getRepos: [Repo]
        getRepo(id: ID!): Repo
    }

    schema {
        query: Query
    }
`;
