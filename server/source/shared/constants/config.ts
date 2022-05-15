const config = Object.freeze({
  server: Object.freeze({
    port: process.env.PORT
  }),
  db: Object.freeze({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432
  })
});

export default config;
