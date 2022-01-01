// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html#configuration-structure
const path = require('path');
const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env('DATABASE_URL'));
  return {
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'postgres',
          host,
          port,
          database,
          user,
          password,
          ssl: {
            rejectUnauthorized: env('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
          },
        },
        options: {
          ssl: env('DATABASE_SSL', false),
        },
      },
    },
  };
};
