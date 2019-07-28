# React Admin Potgraphile Data Provider

This is a data provider that connects [postgraphile](https://www.graphile.org/postgraphile/) with [react admin](https://github.com/marmelab/react-admin). It is build on top of [ra-data-graphql](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql). n.b. the docs for ra-data-graphql are out of date.

**Under active development**. Although I am using this library in production, it does not cover the full API of react admin. Please raise an issue if there is something in particular that you need.

## API

### `buildGraphQLProvider(options)`
Creates a data provider
#### Params
  1. Options object
    * **apolloHttpLinkOptions**: Options passed to apollo http link. [docs here](https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-http)
    * buildQuery (optional): You can use this to extend ra-postgraphile-client

## simple example
```js
import buildPostgraphileProvider from 'ra-postgraphile-provider'

const raDataProvider = buildPostgraphileProvider()
```

## Example with auth
```js
import buildPostgraphileProvider from 'ra-postgraphile-provider'

const raDataProvider = buildPostgraphileProvider({
  apolloHttpLinkOptions: {
    uri: `my-custom-graphql-enpoint.io/graphwhat`
    fetch: (url, options) => {
      // You can add custom auth logic with a wrapper around fetch
      const token = localStorage.getItem('token')

      if (!token) {
        return ;
      } if (jwt.decode(token).exp < Date.now()) {
        localStorage.removeItem('token')
        return ;
      }

      const headers = {
        ...options.headers,
        authorization: `bearer ${token}`
      }
      return fetch(url, ({ ...options, headers }))
    }
  }
})
```

## Authentication
You will need to implement an [auth provider](https://marmelab.com/react-admin/Authentication.html) to handle log in and log out.

## todo
  - [ ] Build out test suite
    - [x] Build postgraphile server mocker
    - [ ] add test script
    - [ ] build out coverage
  - [x] Write readme
  - [x] Test on live project
  - [x] publish
  - [ ] Cover all query types
    - [ ] GET_LIST
      - [x] pagination
      - [ ] sort
      - [ ] order
      - [ ] filter
    - [x] GET_ONE
      - [x] id
    - [x] UPDATE
      - [x] id
      - [x] data
    - [ ] UPDATE_MANY
      - [ ] ids
      - [ ] data
    - [ ] DELETE
      - [ ] id
    - [ ] DELETE_MANY
      - [ ] ids
    - [x] GET_MANY
      - [x] ids
    - [ ] GET_MANY_REFERENCE
      - [ ] target
      - [ ] id
      - [ ] pagination
      - [ ] perPage
      - [ ] sort
      - [ ] filter
