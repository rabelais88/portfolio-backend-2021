module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'e7235af32930123d4c5f635946357283'),
  },
});
