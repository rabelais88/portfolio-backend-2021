module.exports = ({ env }) => ({
  graphql: {
    config: {
      endpoint: '/graphql',
      // shadowCRUD: true,
      playgroundAlways: true,
      //   depthLimit: 7,
      //   amountLimit: 100,
      //   apolloServer: {
      //     tracing: false,
      //   },
    },
  },
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
  'preview-button': {
    enabled: true,
    resolve: './src/plugins/preview-button',
  },
  'wysiwyg-tui-editor': {
    enabled: true,
    resolve: './src/plugins/strapi-plugin-wysiwyg-tui-editor',
  },
});
