// https://www.algolia.com/doc/api-reference/api-methods/save-objects/
const algoliasearch = require('algoliasearch');

class Algolia {
  constructor() {
    this.client = null;
  }
  init({ appId = '', apiKey = '' }) {
    this.client = algoliasearch(appId, apiKey);
  }
  /**
   * @description
   * setting facets(filters) & replicas, ranking for sorting
   * @param {string} index
   * @param {string[]} facets - used for tag filtering
   * @param {string[]} replicas - used for sorting
   * @param {string[]} ranking - used for sorting
   * @return {Promise}
   */
  settings(index, { facets = [], replicas = [], ranking = [] } = {}) {
    const settings = {};
    if (facets.length >= 1) settings.attributesForFaceting = facets;
    if (replicas.length >= 1) settings.replicas = replicas;
    if (ranking.length >= 1) settings.ranking = ranking;
    // https://www.algolia.com/doc/api-reference/api-parameters/attributesForFaceting/#examples
    return this.client.initIndex(index).setSettings(settings);
  }
  /**
   * @description
   * exposes default .setSettings
   * @param {string} index
   * @param {*} settings
   * @returns {Promise}
   */
  rawSettings(index, settings = {}) {
    return this.client.initIndex(index).setSettings(settings);
  }
  /**
   * @param {string} index
   * @param {string} newIndexName
   * @param {string[]} indices
   * @returns {Promise}
   */
  async makeSortedIndex(index, newIndexName, indices) {
    // create replica
    await this.settings(index, { replicas: [newIndexName] });
    // set up property ranking for replica
    await this.settings(newIndexName, { ranking: indices });
  }
  /**
   * @description
   * delete all indices
   * @param {string} index
   * @return {Promise}
   */
  deleteObjects(index) {
    return this.client.initIndex(index).delete().wait();
  }
  /**
   * @description
   * replace or add multiple objects
   * @param {string} index
   * @param {*[]} objects
   * @return {Promise}
   */
  saveObjects(index, objects) {
    return this.client.initIndex(index).saveObjects(objects).wait();
  }
  /**
   * @description
   * replace or add single object
   * @param {string} index
   * @param {*} object
   * @return {Promise}
   */
  saveObject(index, object) {
    return this.client.initIndex(index).saveObject(object).wait();
  }
  /**
   * @description
   * update single object, maintains missing attributes
   * @param {string} index
   * @param {*} object
   * @return {Promise}
   */
  updateObject(index, object) {
    return this.client.initIndex(index).partialUpdateObject(object).wait();
  }
  /**
   * @description
   * delete single object
   * @param {string} index
   * @param {string} objectId
   * @return {Promise}
   */
  deleteObjectById(index, objectId = '') {
    return this.client.initIndex(index).deleteObject(objectId).wait();
  }
  /**
   * @description
   * delete multiple objects
   * @param {string} index
   * @param {string[]} objectIds
   * @return {Promise}
   */
  deleteObjectsById(index, objectIds = []) {
    return this.client.initIndex(index).deleteObjects(objectIds).wait();
  }
  /**
   * delete single object by query
   * @param {string} index
   * @param {*} query
   */
  deleteBy(index, query) {
    return this.client.initIndex(index).deleteBy(query);
  }
  /**
   * @typedef Post
   * @type {{
   *   id: string;
   *   title: string;
   *   content: string;
   *   uid: string;
   *   createdAt: string;
   *   updatedAt: string;
   *   dateOverride: string;
   *   publishedAt: string;
   *   tags: [{ id: string; label: string; key: string;}]
   * }}
   */

  /**
   * @param {Post} post
   */
  mapPostForIndex({ tags = [], ...post }) {
    const dateOverride = post.dateOverride
      ? new Date(post.dateOverride).getTime()
      : 0;
    const updatedAt = post.updatedAt ? new Date(post.updatedAt).getTime() : 0;
    let updatedAtTimestamp = updatedAt;
    if (dateOverride > 0) updatedAtTimestamp = dateOverride;
    return {
      ...post,
      tags: tags.map((t) => ({ id: t.id, key: t.key, label: t.label })),
      compositeTags: tags.map((tag) => [tag.key, tag.label].join('||')),
      updatedAtTimestamp,
      objectID: post.id,
    };
  }
}

module.exports = new Algolia();
