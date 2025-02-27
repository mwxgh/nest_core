import {
  Transform,
  TransformFnParams,
  TransformOptions,
} from 'class-transformer'
import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js'
import { castArray, isNil, map, trim } from 'lodash'
import { RegexConstant } from '@/constants'

export const Trim: PropertyDecorator = Transform(
  ({ value }: TransformFnParams) => {
    if (Array.isArray(value)) {
      return map(value, (v) => {
        const str = typeof v === 'string' ? v : undefined
        return str ? trim(str).replace(/\s\s+/g, ' ') : str
      })
    }

    if (typeof value === 'string') {
      return trim(value).replace(/\s\s+/g, ' ')
    }
  },
)

export const ToBoolean = (options?: TransformOptions): PropertyDecorator =>
  Transform(
    ({ value }: TransformFnParams) => {
      switch (value) {
        case 'true':
          return true
        case 'false':
          return false
        case 1:
          return true
        case 0:
          return false
        default:
          return false
      }
    },
    { toClassOnly: true, ...(options && options) },
  )

export const ToTime = (options?: TransformOptions): PropertyDecorator =>
  Transform(
    ({ value }: TransformFnParams) =>
      typeof value === 'string' ? value.slice(0, -3) : undefined,
    {
      ...(options ?? {}),
    },
  )

export const ToInt: PropertyDecorator = Transform(
  ({ value }: TransformFnParams) => {
    if (typeof value === 'number') return value

    if (typeof value === 'string') return Number.parseInt(value, 10)
  },
  { toClassOnly: true },
)

export const ToArray: () => PropertyDecorator = () =>
  Transform(
    ({ value }: TransformFnParams) =>
      isNil(value) ? [] : (castArray(value) as unknown[]),
    {
      toClassOnly: true,
    },
  )

export const ToLowerCase: () => PropertyDecorator = () =>
  Transform(
    ({ value }: TransformFnParams) => {
      if (!value) return undefined

      if (typeof value === 'string') {
        return value.toLowerCase()
      }

      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === 'string' ? v.toLowerCase() : String(v),
        )
      }

      if (typeof value === 'object') {
        return undefined
      }
    },
    { toClassOnly: true },
  )

export const ToUpperCase: () => PropertyDecorator = () =>
  Transform(
    ({ value }: TransformFnParams) => {
      if (!value) return undefined

      if (typeof value === 'string') {
        return value.toUpperCase()
      }

      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === 'string' ? v.toUpperCase() : String(v),
        )
      }

      if (typeof value === 'object') {
        return undefined
      }
    },
    { toClassOnly: true },
  )

export const ToPhoneNumberSerializer: (
  defaultCountry?: CountryCode,
) => PropertyDecorator = (defaultCountry = 'VN') =>
  Transform(
    ({ value }: TransformFnParams) =>
      parsePhoneNumberWithError(value as string, defaultCountry).number,
  )

export const ToDateFormat: () => PropertyDecorator = () =>
  Transform(({ value }: TransformFnParams) => {
    if (!value || !(typeof value === 'string' || value instanceof Date)) {
      return undefined
    }

    const dateString =
      typeof value === 'string' &&
      RegexConstant.regexDateFormatWithoutTime.test(value)
        ? value
        : value instanceof Date
          ? value.toISOString()
          : undefined

    return dateString ? dateString.split('-').join('/') : undefined
  })

export const ToEscapeString: () => PropertyDecorator = () =>
  Transform(({ value }: TransformFnParams): string | undefined => {
    if (typeof value === 'string') {
      return value.replace(RegexConstant.escapeString, '\\$&')
    }
    return undefined
  })

export const NullToDefault: (defaultValue?: number) => PropertyDecorator = (
  defaultValue = 0,
) =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') return parseInt(value, 10)
    if (typeof value === 'number' && !isNaN(value)) return value
    return defaultValue
  })
