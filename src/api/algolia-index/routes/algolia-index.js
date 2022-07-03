module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/algolia-index',
      handler: 'algolia-index.updatePosts', // controller name
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
