// https://www.algolia.com/doc/api-reference/api-methods/save-objects/
const algoliasearch = require('algoliasearch');

class Algolia {
  constructor() {
    this.client = null;
  }
  init({ appId = '', apiKey = '' }) {
    console.log('initiating algolia...', appId);
    this.client = algoliasearch(appId, apiKey);
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
}

module.exports = new Algolia();
