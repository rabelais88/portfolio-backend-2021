// https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#available-lifecycle-events
const { nanoid } = require('nanoid');
const slugify = require('slugify');

const postUpdated = async (event) => {};

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (!data.uid && data.title) {
      data.uid = `${slugify(data.title)}-${nanoid(5)}`;
    }
  },
  async afterCreate(event) {
    strapi.log.info('post:afterCreate()');
    await postUpdated(event);
  },
  beforeUpdate(event) {
    const { data } = event.params;
    strapi.log.info('post:beforeUpdate()');
    // const {content = ''} = event?.params?.data;
    if (!data.uid && data.title) {
      data.uid = `${slugify(data.title)}-${nanoid(5)}`;
    }
  },
  async afterUpdate(event) {
    strapi.log.info('post:afterUpdate()');
    const { result } = event;
    console.log(event);
    // indexing is prohibited for draft
    if (result.publishedAt) {
      strapi.log.info('post:afterCreate indexing');
      const postIndex = strapi
        .service('api::algolia-index.algolia')
        .mapPostForIndex(result);
      await strapi
        .service('api::algolia-index.algolia')
        .saveObject('posts', postIndex);
    }
  },
  async beforeDelete(event) {
    await strapi
      .service('api::algolia-index.algolia')
      .deleteObjectById('posts', event.params.where.id);
  },
  async beforeDeleteMany(event) {
    const objectIds = event.params.where.$and[0].id.$in;
    await strapi
      .service('api::algolia-index.algolia')
      .deleteObjectsById('posts', objectIds);
  },
};
