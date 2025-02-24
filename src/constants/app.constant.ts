export const IS_PUBLIC = 'isPublic'
export const CSRF_PROPERTY = '_csrf'
export const ROLES = 'roles'

export const AppConstant = {
  test: 'test',
  dev: 'development',
  prod: 'production',
  stg: 'staging',
  startQueryInsert: 'INSERT INTO',
  uniqueQueryCode: 'ER_DUP_ENTRY',
  locationMomentTimezone: 'Asia/Ho_Chi_Minh',
  blackListField: ['username', 'email', 'password'],
  numDigitsHidden: 6,
  characterHidden: '*',
  maxCharacterLog: 200,
  maxDelayDays: 999,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  },
  defaultPassword: 'Aa@123456',
  defaultUserId: 0,
  retryAttempts: 3,
  awsS3PresignedExpiresIn: 1800,
  maxParamLength: 1000,
  maxRecordHandleOnce: 1000,
}
