module.exports = {
  // Custom webpack config
  webpack: (config, webpack) => {
    // ----- code below does not work at the moement
    // config.plugins.push(
    //   new webpack.DefinePlugin({
    //     PREVIEW_HOST_URL: JSON.stringify(process.env.PREVIEW_HOST_URL),
    //     PREVIEW_KEY: JSON.stringify(process.env.PREVIEW_KEY),
    //   })
    // );
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the mutated config
    return config;
  },

  // App customizations
  app: (config) => {
    // config.locales = ['ru', 'zh'];

    return config;
  },
};
