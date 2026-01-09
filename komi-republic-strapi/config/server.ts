export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://158.160.167.43'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
