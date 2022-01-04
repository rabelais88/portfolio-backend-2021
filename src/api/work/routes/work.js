'use strict';

/**
 * work router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::work.work', {
  config: { find: { auth: false }, findOne: { auth: false } },
});
