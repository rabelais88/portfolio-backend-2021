'use strict';
const algolia = require('./algolia');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      algolia.init({
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
      });
    } catch (err) {
      console.error(err);
    }
    if (process.env.INDEXING_ON_BOOT === 'true') {
      const _posts = Array.from(
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
      );
      const posts = await Promise.all(_posts.map(algolia.mapPostForIndex));
      console.log(`updating ${posts.length} post(s)...`);
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
      algolia.saveObjects('posts', posts);
    }
  },
};
