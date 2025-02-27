import { ValidationOptions } from 'class-validator'
import {
  ArrayMaxSize as _ArrayMaxSize,
  ArrayMinSize as _ArrayMinSize,
  IsAlphanumeric as _IsAlphanumeric,
  IsArray as _IsArray,
  IsBoolean as _IsBoolean,
  IsDate as _IsDate,
  IsEnum as _IsEnum,
  IsInt as _IsInt,
  IsJSON as _IsJSON,
  IsNotEmpty as _IsNotEmpty,
  IsNumber as _IsNumber,
  IsNumberString as _IsNumberString,
  IsPhoneNumber as isPhoneNumber,
  IsPositive as _IsPositive,
  IsString as _IsString,
  Matches,
  Max as _Max,
  MaxLength as _MaxLength,
  Min as _Min,
  MinLength as _MinLength,
  ValidateIf,
} from 'class-validator'
import { RegexConstant } from '@/constants'
import { ValidationLogicMessage, ValidationTypeMessage } from '@/messages'

const makeOption = (
  options?: string | ValidationOptions,
): ValidationOptions | undefined => {
  return typeof options == 'string'
    ? {
        context: {
          name: options,
        },
      }
    : options
}

export const IsPhoneNumber = (
  validationOptions?: ValidationOptions & {
    region?: Parameters<typeof isPhoneNumber>[0]
  },
): PropertyDecorator => {
  return isPhoneNumber(validationOptions?.region, {
    message: ValidationTypeMessage.isPhoneNumber,
    ...validationOptions,
  })
}

export const IsUndefinable = (
  options?: ValidationOptions,
): PropertyDecorator => {
  return ValidateIf((obj, value) => value !== undefined, options)
}

export const IsNullable = (options?: ValidationOptions): PropertyDecorator => {
  return ValidateIf((obj, value) => value !== null, options)
}

export const IsInt = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsInt({ message: ValidationTypeMessage.isInt, ...makeOption(options) })

export const IsNotEmpty = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNotEmpty({
    message: ValidationTypeMessage.isNotEmpty,
    ...makeOption(options),
  })

export const IsBoolean = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsBoolean({
    message: ValidationTypeMessage.isBoolean,
    ...makeOption(options),
  })

export const IsDate = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsDate({
    message:
      (options as ValidationOptions)?.message ?? ValidationTypeMessage.isDate,
    ...makeOption(options),
  })

export const IsString = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsString({ message: ValidationTypeMessage.isString, ...makeOption(options) })

export const IsNumberString = (
  options?: validator.IsNumericOptions,
  validOptions?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNumberString(
    { ...options },
    {
      message: ValidationTypeMessage.isNumberString,
      ...makeOption(validOptions),
    },
  )

export const IsAlphanumeric = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsAlphanumeric('en-US', {
    message: ValidationTypeMessage.isAlphaNumeric,
    ...makeOption(options),
  })

export const IsNumber = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsNumber(
    {},
    { message: ValidationTypeMessage.isNumber, ...makeOption(options) },
  )

export const IsPositive = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsPositive({
    message: ValidationTypeMessage.isPositive,
    ...makeOption(options),
  })

export const IsArray = (
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _IsArray({
    message: ValidationTypeMessage.isArray,
    ...makeOption(options),
  })

export const IsTime = (validationOptions?: ValidationOptions) => {
  return Matches(RegexConstant.timeFormat, {
    ...validationOptions,
    message: ValidationTypeMessage.isTime,
  })
}

export const ArrayMinSize = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _ArrayMinSize(minValue, {
    message: ValidationLogicMessage.arrayMinSize,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const ArrayMaxSize = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _ArrayMaxSize(maxValue, {
    message: ValidationLogicMessage.arrayMaxSize,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const Max = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _Max(maxValue, {
    message:
      (options as ValidationOptions).message ??
      ValidationLogicMessage.isLessThan,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const Min = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _Min(minValue, {
    message:
      (options as ValidationOptions).message ??
      ValidationLogicMessage.isGreaterThan,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const MaxLength = (
  maxValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _MaxLength(maxValue, {
    message: ValidationLogicMessage.maxLength,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: maxValue } } },
    ),
  })

export const MinLength = (
  minValue: number,
  options?: string | ValidationOptions,
): PropertyDecorator =>
  _MinLength(minValue, {
    message: ValidationLogicMessage.minLength,
    ...makeOption(
      typeof options === 'string'
        ? options
        : { ...options, ...{ context: { value: minValue } } },
    ),
  })

export const IsEnum = (
  enumValue: object,
  options?: string | ValidationOptions,
): PropertyDecorator => {
  return _IsEnum(enumValue, {
    message: ValidationTypeMessage.isInvalid,
    ...makeOption(options),
  })
}

export const IsTimeString = (
  format: string,
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationTypeMessage.isTimeStringFormat.replace(
      '$format',
      format,
    ),
  })
}

export const IsPhoneString = (
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationTypeMessage.isValidPhoneDigit,
  })
}

export const IsHexColorString = (
  regex: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return Matches(regex, {
    ...validationOptions,
    message: ValidationTypeMessage.isHexColorStringFormat,
  })
}

export const IsJSON = (
  options?: string | ValidationOptions,
): PropertyDecorator => {
  return _IsJSON({
    ...makeOption(options),
    message: ValidationTypeMessage.isJsonString,
  })
}
