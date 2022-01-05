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
    if (process.env.INDEXING_ON_BOOT === 'true') {
      algolia.init({
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
      });
      const posts = Array.from(
        await strapi.db.query('api::post.post').findMany({
          populate: {
            tags: true,
          },
        })
      ).map((p) => ({ ...p, objectID: p.id }));
      console.log(`updating ${posts.length} post(s)...`);
      // the Promise is left unwaited intentionally
      await algolia.deleteObjects('posts');
      algolia.saveObjects('posts', posts);
    }
  },
};
