module.exports = ({ env }) => [
  'strapi::errors',
  // 'strapi::security',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'connect-src': ["'self'", 'https:'],
          'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
          'img-src': [
            "'self'",
            'data:',
            'cdn.jsdelivr.net',
            'strapi.io',
            `${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`,
            'sungryeol-portfolio.herokuapp.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            `${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
