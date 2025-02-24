export default () => ({
  app: {
    port: process.env.APP_PORT ?? 3000,
    name: process.env.APP_NAME,
    env: process.env.APP_ENV ?? 'development',
    url: process.env.APP_URL,
    timeout: process.env.APP_TIMEOUT ?? 30000,
  },

  fileUpload: {
    destination: process.env.FILE_UPLOAD_DESTINATION ?? 'uploads',
    maxSize: parseInt(String(process.env.FILE_UPLOAD_MAX_SIZE), 10) ?? 52428800,
  },

  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTtl: process.env.JWT_REFRESH_TTL,
    algorithm: process.env.JWT_ALGORITHM ?? 'HS256',
  },

  database: {
    driver: process.env.DATABASE_DRIVER as 'mysql' | 'mongodb',
    host: process.env.DATABASE_HOST,
    port: parseInt(String(process.env.DATABASE_PORT), 10) ?? 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    db: process.env.DATABASE_DB,
    logger: process.env.DATABASE_LOGGER,
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
