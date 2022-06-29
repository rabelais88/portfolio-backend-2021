// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html#configuration-structure
const path = require('path');
const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  try {
    const { host, port, database, user, password } = parse(env('DATABASE_URL'));
    const isLocal = process.env.NODE_ENV === 'local';
    const ssl = env('DATABASE_SSL', false);
    const sslParams = isLocal &&
      ssl && { rejectUnauthorized: env('DATABASE_REJECT_UNAUTHORIZED', false) };
    return {
      connection: {
        client: 'postgres',
        connection: {
          host,
          port,
          database,
          user,
          password,
          ssl: sslParams,
        },
        options: {
          ssl: env('DATABASE_SSL', false),
        },
      },
    };
  } catch (err) {
    console.log('missing database config. this is only allowed for build');
    return {};
  }
};
