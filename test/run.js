const fetch = require('isomorphic-fetch')

const postgraphileServer = require('../lib/create_postgraphile_server.js')
const buildPostgraphileProvider = require('../')

const tearupSchema = `
  CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
  );

  INSERT INTO person(name) VALUES('Eoin McCarthy');
  INSERT INTO person(name) VALUES('Tipu FitzHerbert');
`

const teardownSchema = `
  DROP TABLE person;
`

const connectionUrl =
  'postgresql://postgres:postgres@localhost:5432/ra_postgraphile_client'


const run = async () => {
  const server = await postgraphileServer(
    tearupSchema, teardownSchema, connectionUrl, 3000)
  return {
    provider: await buildPostgraphileProvider({
      apolloHttpLinkOptions: {
        uri: `http://localhost:3000/graphql`,
        fetch
      }
    }),
    server
  }
}

run().then(async ({ server, provider }) => {
  const providerResponse = await provider('GET_LIST', 'person', { pagination: { page: 1, perPage: 1 }})

  console.log(JSON.stringify(providerResponse, null, 4))

  await server.stop()

  process.exit()
})
