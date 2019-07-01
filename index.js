const buildGraphQLProvider = require('ra-data-graphql').default
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { ApolloClient } = require('apollo-client')
const { ApolloLink } = require('apollo-link')

const buildQuery = require('./lib/build_query')
const introspection = require('./lib/introspection')


const buildPostgraphileProvider = ({ apolloHttpLinkOptions }) => {

  const httpLink = createHttpLink(apolloHttpLinkOptions);

  const token = localStorage.getItem("token")
  const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: token ? {
        authorization:  `Bearer ${token}`
      } : {
      }
    });
    return forward(operation);
  });

  const link = middlewareLink.concat(httpLink);

  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  })

  return buildGraphQLProvider({
    client,
    buildQuery,
    introspection
  })
}

module.exports = buildPostgraphileProvider
