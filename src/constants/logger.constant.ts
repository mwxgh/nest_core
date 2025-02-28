export const LoggerConstant = {
  fileName: `${process.env.NODE_ENV}-%DATE%.log`,
  storageDirname: 'logs',
  maxFiles: 365,
  fatalLevel: 'fail',
  errorLevel: 'error',
  warnLevel: 'warn',
  infoLevel: 'info',
  debugLevel: 'debug',
  queryPrefix: 'Query: ',
  parameterPrefix: ' -- PARAMETERS: ',
  queryLogLevels: ['error', 'migration'],
  queryLogLevelsDev: ['log', 'warn', 'query', 'schema', 'migration'],
  queryLogLevelsTest: ['log', 'warn'],
  backgroundJobContext: 'BackgroundJob',
  queryFailed: 'Query failed',
  uncaughtException: 'UncaughtException',
  unhandledRejection: 'UnhandledRejection',
}
