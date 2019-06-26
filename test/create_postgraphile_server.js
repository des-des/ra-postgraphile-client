const http = require('http')
const { Client } = require('pg')
const { postgraphile } = require('postgraphile')

module.exports = async (tearupSchema, teardownSchema, databaseUrl, port) => {
  const self = {}
  const my = {}

  my.pgClient = new Client({
    connectionString: databaseUrl
  })

  await my.pgClient.connect()

  try {
    await my.pgClient.query(tearupSchema)
  } catch (e) {
    console.error(e)
  }

  const postgraphileHandler = postgraphile(databaseUrl, { graphiql: true, extendedErrors: ['hint', 'detail'] })

  my.server = http.createServer(postgraphileHandler)

  self.stop = async () => {
    await my.pgClient.query(teardownSchema)
    await my.pgClient.end()

    return new Promise(resolve => my.server.close(resolve))
  }

  return new Promise(resolve => my.server.listen(port, () => resolve(self)));
}
