const gql = require('graphql-tag')

const capitalize = str => str[0].toUpperCase() + str.slice(1)

module.exports = introspection => (raFetchType, resourceName, params) => {
  const resourceTypename = capitalize(resourceName)
  const { types, resources } = introspection
  const resource = resources.find(r => r.type.name === resourceTypename);
  const type = types.find(t => t.name === resourceTypename);

    switch (raFetchType) {
          case 'GET_ONE':
              return {
                  query: gql`query ${resource[raFetchType].name}($id: Int!) {
                      ${resource[raFetchType].name}(id: $id) {
                        ${type.fields.map(f => f.name).join('\n')}
                      }
                  }`,
                  variables: params,
                  parseResponse: response => response.data,
              }
              break;
          case 'GET_LIST':
              return {
                  query: gql`query ${resource[raFetchType].name}($offset: Int!, $first: Int!) {
                      ${resource[raFetchType].name}(first: $first, offset: $offset) {
                        nodes {
                          ${type.fields.map(f => f.name).join('\n')}
                        }
                      }
                  }`,
                  variables: {
                    offset: params.pagination.page * params.pagination.perPage,
                    first: params.pagination.perPage
                  },
                  parseResponse: response => response.data,
              }
              break;
      }

}
