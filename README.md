# React Admin Potgraphile Data Provider

This is a data provider that connects [postgraphile](https://www.graphile.org/postgraphile/) with [react admin](https://github.com/marmelab/react-admin). It is build on top of (ra-data-graphql)[https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql]. n.b. the docs for ra-data-graphql are out of date.

**Under active development**. Right now this library does not have a stable API. If you want to use this in production please raise an issue and I will release a v1.0.0.

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
      - [ ] filter
    - [x] GET_ONE  
    - [ ] UPDATE
    - [ ] UPDATE_MANY
    - [ ] DELETE
    - [ ] DELETE_MANY
    - [ ] GET_MANY
    - [ ] GET_MANY_REFERENCE
