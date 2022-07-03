'use strict';

const initRoles = async ({ strapi }) => {
  strapi.log.info('check role initialization');
  // https://github.com/strapi/strapi/blob/master/packages/plugins/users-permissions/server/services/role.js
  /** @typedef {{ id: number; action: string; createdAt: string; updatedAt: string; }} UserPermission */
  /** @typedef {{ id: number; name: 'Public'; description: string; type: string; createdAt: string; updatedAt: string; permissions?: UserPermission[] }} UserRole */
  /** @type {UserRole} */
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' }, populate: ['permissions'] });

  if (!publicRole) {
    strapi.log.error('public role not found!');
    return;
  }
  // must allow guest users to navigate

  const guestAllowedActions = [
    // multi post types
    'api::post.post.find',
    'api::post.post.findOne',
    'api::tag.tag.find',
    'api::tag.tag.findOne',
    // single post types
    'api::work.work.find',
    'api::contact.contact.find',
    'api::algolia-index.algolia-index.updatePosts',
  ];

  const publicRoleActions = publicRole.permissions.map((p) => p.action);
  const missingActions = guestAllowedActions.filter(
    (a) => !publicRoleActions.includes(a)
  );
  if (missingActions.length === 0) {
    strapi.log.info('skip role initialization:already initialized');
    return;
  }
  console.log('missing actions from public role:', missingActions);

  strapi.log.info('initializing roles...');

  const roleJobs = missingActions.map((action) =>
    strapi
      .query('plugin::users-permissions.permission')
      .create({ data: { action, role: publicRole.id } })
  );
  await Promise.all(roleJobs);
  strapi.log.info('role initialized!');
};

/**  */
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
    await strapi
      .service('api::algolia-index.algolia-index')
      .init(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
    if (process.env.INDEXING_ON_BOOT === 'true') {
      await strapi.service('api::algolia-index.algolia-index').updatePosts();
    }
  },
};
