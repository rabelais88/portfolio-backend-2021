'use strict';
const algolia = require('./algolia');

/**
 * algolia-index service.
 */

module.exports = ({ strapi }) => ({
  init: async (appId, apiKey) => {
    try {
      strapi.log.info('initializing algolia service...');
      // env variables are not exposed via strapi logger
      console.log('ALGOLIA_APP_ID', appId);
      algolia.init({ appId, apiKey });
      strapi.log.info('algolia service initialized');
    } catch (err) {
      strapi.log.error(err);
    }
  },
  updatePosts: async () => {
    strapi.log.info('algolia-index:updatePosts()');
    const posts = Array.from(
      await strapi.db.query('api::post.post').findMany({
        where: {
          publishedAt: {
            $notNull: true,
          },
        },
        populate: {
          tags: true,
        },
      })
    ).map(algolia.mapPostForIndex);
    strapi.log.info(`updating ${posts.length} post(s)...`);
    // the Promise is left unwaited intentionally
    await algolia.deleteObjects('posts');
    await algolia.settings('posts', {
      facets: ['searchable(compositeTags)'],
    });
    await algolia.makeSortedIndex('posts', 'post_updated_at', [
      'desc(updatedAtTimestamp)',
    ]);
    await algolia.settings('post_updated_at', {
      facets: ['searchable(compositeTags)'],
    });
    await algolia.rawSettings('post_updated_at', {
      // https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/highlighting-snippeting/js/#nbwords
      // 40 letters max
      attributesToSnippet: ['content:40'],
    });
    algolia.saveObjects('posts', posts);
    strapi.log.info('algolia-index:updatePosts() finished');
  },
});
