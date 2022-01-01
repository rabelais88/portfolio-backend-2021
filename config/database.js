// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html#configuration-structure
const path = require('path');
const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env('DATABASE_URL'));
  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: env('DATABASE_SSL', false),
      },
    },
  };
};
