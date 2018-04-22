import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import { Repos } from './repo';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000/graphql',
});

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
      <Repos />
    </div>
  </ApolloProvider>
);

export default App;
