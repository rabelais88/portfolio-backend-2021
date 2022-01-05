// WIP. use inside src/index.js -> bootstrap()
const algoliasearch = require('algoliasearch');

class Algolia {
  init({ appId = '', apiKey = '' }) {
    console.log('initiating algolia...');
    this.client = algoliasearch(appId, apiKey);
    this.indexPosts = client.initIndex('posts');
  }
}

module.exports = new Algolia();
