'use strict';

/**
 * A set of functions called "actions" for `algolia-index`
 */

module.exports = {
  updatePosts: async (ctx, next) => {
    try {
      await strapi.service('api::algolia-index.algolia-index').updatePosts();
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
};
