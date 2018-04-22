import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const Repos = () => (
    <Query
        query={gql`
          {
            getRepos {
              id
              name
              language
              stars
            }
          }
        `}
    >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return data.getRepos.map(({ id, name, stars, language }) => (
            <div key={id}>
              <p>{ name } - <span>{ language || 'Others' } - { stars }</span></p>
            </div>
          ));
        }}
    </Query>
);
