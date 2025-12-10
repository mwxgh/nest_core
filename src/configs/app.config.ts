import 'dotenv/config'

export const CustomConfig = () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: process.env.API_PORT ?? 3000,
    name: process.env.API_NAME,
    url: process.env.API_URL,
    timeout: process.env.API_TIMEOUT ?? 30000,
    timezone: process.env.TZ,
  },

  jwt: {
    privateKey: process.env.JWT_PRIVATE_KEY,
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshTtl: process.env.JWT_REFRESH_TTL,
  },

  database: {
    url: process.env.DATABASE_URL!,
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    name: process.env.DATABASE_NAME!,
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

  firebase: {
    // common
    project_id: process.env.FIREBASE_PROJECT_ID!,
    // admin
    type: process.env.FIREBASE_TYPE,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: (process.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL!,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    // client
    api_key: process.env.FIREBASE_API_KEY!,
    auth_domain: process.env.FIREBASE_AUTH_DOMAIN,
    messaging_sender_id: process.env.FIREBASE_MESSAGING_SENDER_ID,
    app_id: process.env.FIREBASE_APP_ID,
  },
})
