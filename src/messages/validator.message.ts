import { ValidationMessages } from '@/utils/declare'

export const ValidationTypeMessage: ValidationMessages = {
  isInvalid: '$field has an invalid value',
  isInt: '$field must be an integer.',
  isNotEmpty: '$field must be input',
  isAlphaNumeric: '$field must be alphabets and numbers',
  isNumber: '$field must be a number',
  isPositive: '$field must be a positive number',
  isString: '$field must be a string',
  isArray: '$field must be an array',
  isNumberString: '$field must be a string of number',
  isBoolean: '$field must be a boolean',
  isDate: '$field must be a Date instance',
  isTime: '$field must be a Time instance',
  isTimeStringFormat: '$field must be a time string format',
  isEmail: '$field must be an email',
  isJsonString: '$field must be a json string',
  isHexColorStringFormat: '$field must be hex color format',
  isValidPhoneDigit: 'Please enter a valid phone number',
  isPassword:
    'Please use at least 10 characters, including uppercase letters, lowercase letters, numbers, and symbols.',
  isPhoneNumber: 'Only numbers and $1~$2 numbers can be used.',
}

export const ValidationLogicMessage: ValidationMessages = {
  arrayMaxSize: '$field must contain not more than $1 elements',
  arrayMinSize: '$field must contain at least $1 elements',
  arrayUnique: '$field must contain element unique',
  isLessOrEqual: '$field must be less than or equal $argument',
  isGreaterOrEqual: '$field must be greater than or equal $argument',
  isLessThan: '$field must be less than $1',
  isGreaterThan: '$field must be greater than $1',
  maxLength: '$field exceeds the maximum length of $1 characters.',
  minLength: '$field must be at least $1 characters long.',
  timeEarlierThanField: 'Please enter a date earlier than $field',
}

export const ValidationCustomLogicMessage: ValidationMessages = {
  isInvalidDataWithStatus:
    'There are some invalid data with user retirement status',
  isLaterWithDateOrTimeOnly: 'Cannot enter a time before the start time',
  untilCurrentTime: 'Input is possible up to the current time',
  maxUploadFile: 'Only 10 file upload buttons are available',
  emailMatchWith: 'Does not match the email address entered',
  loginFail: 'Your ID or password is incorrect',
  signUpFail: 'Your ID register has been existed in system',
  forceLogoutWhenLoginLater: 'Login by another user',
  invalidFileType: 'Invalid file format selected',
  cannotCreateOrUpdate:
    '$field could not be completed because it was updated by another user',
}
