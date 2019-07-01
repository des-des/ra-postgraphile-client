const gql = require('graphql-tag')

const capitalize = str => str[0].toUpperCase() + str.slice(1)

const isNotRelation = f => {
  if (f.type.kind === 'OBJECT') return false
  if (f.type.ofType && f.type.ofType.kind === 'OBJECT') return false

  return true
} // hack and incorrect

module.exports = introspection => (raFetchType, resourceName, params) => {
  const resourceTypename = capitalize(resourceName)
  const { types, resources } = introspection
  const resource = resources.find(r => r.type.name === resourceTypename);
  const type = types.find(t => t.name === resourceTypename);
  const fields = type.fields.filter(field => isNotRelation(field))

  switch (raFetchType) {
    case 'GET_ONE':
      return {
        query: gql`query ${resource[raFetchType].name}($id: Int!) {
          ${resource[raFetchType].name}(id: $id) {
            ${fields.map(f => f.name).join('\n')}
          }
        }`,
        variables: { id: typeof params.id === 'string' ? parseInt(params.id, 10) : params.id }, // NOT SURE WHY I NEED TO DO THIS
        parseResponse: response => {
          return {
            data: response.data[resource[raFetchType].name]
          }
        }
      }
      break;
    case 'GET_LIST':
      return {
        query: gql`query ${resource[raFetchType].name}($offset: Int!, $first: Int!) {
          ${resource[raFetchType].name}(first: $first, offset: $offset) {
            nodes {
              ${fields.map(f => f.name).join('\n')}
            }
          }
        }`,
        variables: {
          offset: (params.pagination.page - 1) * params.pagination.perPage,
          first: params.pagination.perPage
        },
        parseResponse: response => {
          const results = response.data[resource[raFetchType].name].nodes
          return {
            data: results,
            total: results.length
          }
        }
      }
      break;
    case 'UPDATE':
      let q
      try {
        q = gql`mutation ${resource[raFetchType].name}($id: Int!) {
          ${resource[raFetchType].name}(
            input: {
              id: $id,
              ${resourceName}Patch: {
                ${
                  Object.entries(params.data)
                  .filter(([propName]) => propName !== 'nodeId' && propName !== '__typename' && propName !== 'id')
                  .map(([propName, propValue]) => `${propName}: ${JSON.stringify(propValue)}`)
                  .join('\n')
                }
              }
            }
          ) {
            ${resourceName} {
              ${fields.map(f => f.name).join('\n')}
            }
          }
        }`
      } catch (e) {
        console.error(e);
      }
      return {
        query: q,
        variables: {
          id: typeof params.id === 'string' ? parseInt(params.id, 10) : params.id
        },
        parseResponse: response => {
          return {
            data: response.data[resource[raFetchType].name][resourceName]
          }
        }
      }
      break;
    }

}
