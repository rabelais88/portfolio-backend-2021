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
    /**
     * @typedef Post
     * @type {{
     *   id: string;
     *   title: string;
     *   content: string;
     *   uid: string;
     *   createdAt: string;
     *   updatedAt: string;
     *   publishedAt: string;
     *   tags: [{ id: string; label: string; key: string;}]
     * }}
     */

    /**
     * @param {Post} post
     */
    const mapIndex = (post) => ({
      ...post,
      compositeTags: post.tags.map((tag) => [tag.key, tag.label].join('||')),
      updatedAtTimestamp: post.updatedAt
        ? new Date(post.updatedAt).getTime()
        : 0,
      objectID: post.id,
    });

    try {
      algolia.init({
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
      });
    } catch (err) {
      console.error(err);
    }
    if (process.env.INDEXING_ON_BOOT === 'true') {
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
      ).map(mapIndex);
      console.log(`updating ${posts.length} post(s)...`);
      // the Promise is left unwaited intentionally
      await algolia.deleteObjects('posts');
      await algolia.settings('posts', {
        facets: ['searchable(compositeTags)'],
        replicas: ['updatedAtTimestamp'],
      });
      algolia.saveObjects('posts', posts);
    }
  },
};
