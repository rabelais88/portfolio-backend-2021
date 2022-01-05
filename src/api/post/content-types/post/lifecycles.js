// https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#available-lifecycle-events
const { nanoid } = require('nanoid');
const algolia = require('../../../../algolia');
module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (!data.uid)
      event.params.data.uid = [
        (data.title ?? 'n').replace(/[\W_ ]+/g, '-'),
        nanoid(5),
      ].join('-');
  },
  async afterCreate(event) {
    const { data } = event.params;
    console.log('object created', event);
    if (!data.objectID) event.params.data.objectID = event.result.id;
    await algolia.saveObject('posts', data);
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
    const { data } = event.params;
    if (!data.objectID) data.objectID = event.result.id;
    await algolia.updateObject('posts', data);
  },
  async beforeDelete(event) {
    await algolia.deleteObjectById('posts', event.params.where.id);
  },
  async beforeDeleteMany(event) {
    const objectIds = event.params.where.$and[0].id.$in;
    await algolia.deleteObjectsById('posts', objectIds);
  },
};
