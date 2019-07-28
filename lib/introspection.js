const camel = str => str[0].toLowerCase() + str.slice(1)

const introspection = {
  operationNames: {
      ['GET_ONE']: resource => `${camel(resource.name)}ById`,
      ['UPDATE']: resource => `update${resource.name}ById`,
      ['DELETE']: resource => `delete${resource.name}ById`
  },
  exclude: undefined,
  include: undefined
}

module.exports = introspection
