// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html#configuration-structure
const path = require('path');
const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env('DATABASE_URL'));
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  const isLocal = process.env.NODE_ENV === 'local';
  const ssl = isLocal
    ? false
    : { rejectUnauthorized: env('DATABASE_REJECT_UNAUTHORIZED', false) };
  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl,
      },
      options: {
        ssl: env('DATABASE_SSL', false),
      },
    },
  };
};
