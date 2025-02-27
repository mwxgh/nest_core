export default () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: process.env.API_PORT ?? 3000,
    name: process.env.API_NAME,
    url: process.env.API_URL,
    timeout: process.env.API_TIMEOUT ?? 30000,
  },

  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTtl: process.env.JWT_REFRESH_TTL,
  },

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ?? 6379,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PW,
    ttl: process.env.REDIS_TTL ?? 300,
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    from: process.env.MAIL_FROM,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },

  minio: {
    endpoint: process.env.MINIO_ENDPOINT ?? 'localhost',
    apiPort: parseInt(String(process.env.MINIO_API_PORT), 10),
    consolePort: parseInt(String(process.env.MINIO_CONSOLE_PORT), 10),
    ssl: false,
    access: process.env.MINIO_ACCESS_KEY ?? 'access',
    secret: process.env.MINIO_SECRET_KEY ?? 'secret',
    bucket: process.env.MINIO_BUCKET_NAME ?? 'bucket',
  },
})
