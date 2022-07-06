// https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/databases.html#configuration-structure
const path = require('path');
const { parse } = require('pg-connection-string');

module.exports = ({ env }) => {
  try {
    const { host, port, database, user, password } = parse(env('DATABASE_URL'));
    const isLocal = process.env.NODE_ENV === 'local';
    const ssl = env('DATABASE_SSL', false) === 'true';
    const sslParams = isLocal
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
          ssl: sslParams,
        },
        options: {
          ssl,
        },
      },
    };
  } catch (err) {
    console.log('missing database config. this is only allowed for build');
    return {};
  }
};
