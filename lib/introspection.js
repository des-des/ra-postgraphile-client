const camel = str => str[0].toLowerCase() + str.slice(1)

const introspection = {
  operationNames: {
      ['GET_ONE']: resource => `${camel(resource.name)}ById`
  },
  exclude: undefined,
  include: undefined
}

module.exports = introspection