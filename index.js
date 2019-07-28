const buildGraphQLProvider = require('ra-data-graphql').default
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')
const { ApolloClient } = require('apollo-client')

const postgraphileBuildQuery = require('./lib/build_query')
const introspection = require('./lib/introspection')


const buildPostgraphileProvider = ({
  apolloHttpLinkOptions,
  buildQuery=postgraphileBuildQuery
}) => {

  const httpLink = createHttpLink(apolloHttpLinkOptions);

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  })

  return buildGraphQLProvider({
    client,
    buildQuery,
    introspection
  }).then(defaultGraphQLProvider => (raFetchType, resourceName, params) => {
    // https://github.com/marmelab/react-admin/blob/4cf148571b9ec80493bca6979b2825ab2dd5e603/packages/ra-data-graphcool/src/index.js#L39
    if (raFetchType === 'GET_MANY') {
      return Promise.all(
        params.ids.map(id =>
          defaultGraphQLProvider('GET_ONE', resourceName, { id }))
      ).then(results => ({
        data: results.reduce(
          (results, result) => ([...results, result.data]),
          [])
        })
      )
    }

    return defaultGraphQLProvider(raFetchType, resourceName, params)
  })
}

module.exports = buildPostgraphileProvider
module.exports.buildQuery = postgraphileBuildQuery
