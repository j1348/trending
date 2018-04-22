import GraphQLJSON from 'graphql-type-json';

export default `
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
        description: String!
        href: String!
        Ticks: [Tick]
        stars: Int!
        forks: Int!
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