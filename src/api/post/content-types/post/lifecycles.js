// https://docs.strapi.io/developer-docs/latest/development/backend-customization/models.html#available-lifecycle-events
const { nanoid } = require('nanoid');
const algolia = require('../../../../algolia');
// const updateHook = require('../../../../updateHook');

const postUpdated = async (event) => {
  const { result } = event;
  console.log('postUpdated() result', result);
  // indexing is prohibited for draft
  if (result.publishedAt) {
    console.log('afterCreate indexing');
    const postIndex = algolia.mapPostForIndex(result);
    await algolia.saveObject('posts', postIndex);
  }
};

module.exports = {
  beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    if (!data.uid)
      data.uid = [(data.title ?? 'n').replace(/[\W_ ]+/g, '-'), nanoid(5)].join(
        '-'
      );
  },
  async afterCreate(event) {
    console.log('afterCreate()---');
    await postUpdated(event);
  },
  beforeUpdate(event) {
    console.log('beforeUpdate()', event);
    // const {content = ''} = event?.params?.data;
  },
  async afterUpdate(event) {
    console.log('afterUpdate()---');
    await postUpdated(event);
  },
  async beforeDelete(event) {
    await algolia.deleteObjectById('posts', event.params.where.id);
  },
  async beforeDeleteMany(event) {
    const objectIds = event.params.where.$and[0].id.$in;
    await algolia.deleteObjectsById('posts', objectIds);
  },
};
