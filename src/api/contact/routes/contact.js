'use strict';

/**
 * contact router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::contact.contact', {
  config: { find: { auth: false }, findOne: { auth: false } },
});
