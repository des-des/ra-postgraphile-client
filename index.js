const buildGraphQLProvider = require('ra-data-graphql').default
const { createHttpLink } = require('apollo-link-http')

const buildQuery = require('./lib/build_query')
const introspection = require('./lib/introspection')

const buildPostgraphileProvider = ({ apolloHttpLinkOptions }) => buildGraphQLProvider({
  clientOptions: {
    link: createHttpLink(apolloHttpLinkOptions)
  },
  buildQuery,
  introspection
})

module.exports = buildPostgraphileProvider
