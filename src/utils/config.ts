export default () => ({
  jwtSecret: 'jwtSecret',
  YANDEX_CLIENT_ID: '29ed83ad2dfa46e8806133e70d022032',
  YANDEX_CLIENT_SECRET: '8a3613d3bb9d41e9bc919aaf8c3f5505',
  YANDEX_REDIRECT_URI: 'http://localhost:3000/oauth/callback',
  port: parseInt(process.env.PORT) || 3000,
  db: {
    database: 'kupipodariday',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: 'student',
    password: 'student',
  },
});
