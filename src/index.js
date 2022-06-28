'use strict';
const algolia = require('./algolia');

const initRoles = async ({ strapi }) => {
  // https://github.com/strapi/strapi/blob/master/packages/plugins/users-permissions/server/services/role.js
  /** @typedef {{ id: number; action: string; createdAt: string; updatedAt: string; }} UserPermission */
  /** @typedef {{ id: number; name: 'Public'; description: string; type: string; createdAt: string; updatedAt: string; permissions?: UserPermission[] }} UserRole */
  /** @type {UserRole} */
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' }, populate: ['permissions'] });
  console.log(publicRole);

  if (!publicRole) {
    strapi.log.fatal('public role not found!');
    return;
  }
  // must allow guest users to navigate
  const roleInitialized =
    publicRole.permissions.findIndex(
      (p) => p.action === 'api::post.post.find'
    ) !== -1;
  if (roleInitialized) return;

  strapi.log.info('initializing roles...');
  const guestAllowedActions = [
    // multi post types
    'api::post.post.find',
    'api::post.post.findOne',
    'api::tag.tag.find',
    'api::tag.tag.findOne',
    // single post types
    'api::work.work.find',
    'api::contact.contact.find',
  ];
  const roleJobs = guestAllowedActions.map((action) =>
    strapi
      .query('plugin::users-permissions.permission')
      .create({ data: { action, role: publicRole.id } })
  );
  await Promise.all(roleJobs);
  strapi.log.info('role initialized!');
};

const initAlgolia = async ({ strapi }) => {
  try {
    algolia.init({
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
    });
  } catch (err) {
    strapi.log.fatal(err);
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
  }
};

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
    await initRoles({ strapi });
    await initAlgolia({ strapi });
  },
};
