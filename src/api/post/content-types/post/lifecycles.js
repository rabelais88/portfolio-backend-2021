// https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#available-lifecycle-events
const { nanoid } = require('nanoid');
const algolia = require('../../../../algolia');
// const updateHook = require('../../../../updateHook');
module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (!data.uid)
      data.uid = [(data.title ?? 'n').replace(/[\W_ ]+/g, '-'), nanoid(5)].join(
        '-'
      );
  },
  async afterCreate(event) {
    const { result } = event;
    console.log('afterCreate()', result);
    // indexing is prohibited for draft
    if (result.publishedAt) {
      if (!result.objectID) result.objectID = result.id;
      result.compositeTags = result.tags.map((tag) =>
        [tag.key, tag.label].join('||')
      );
      await algolia.saveObject('posts', result);
    }
  },
  beforeUpdate(event) {
    const { data } = event.params;
    if (!data.uid)
      event.params.data.uid = [
        (data.title ?? 'n').replace(/[\W_ ]+/g, '-'),
        nanoid(5),
      ].join('-');
  },
  async afterUpdate(event) {
    const { result } = event;
    console.log('afterUpdate()', result);
    // indexing is prohibited for draft
    if (result.publishedAt) {
      result.compositeTags = result.tags.map((tag) =>
        [tag.key, tag.label].join('||')
      );
      if (!result.objectID) result.objectID = result.id;
      await algolia.updateObject('posts', result);
    }
  },
  async beforeDelete(event) {
    await algolia.deleteObjectById('posts', event.params.where.id);
  },
  async beforeDeleteMany(event) {
    const objectIds = event.params.where.$and[0].id.$in;
    await algolia.deleteObjectsById('posts', objectIds);
  },
};
