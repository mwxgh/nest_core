import { AppConstant, RegexConstant } from '@/constants'
import { ValidationLogicMessage, ValidationTypeMessage } from '@/messages'
import { ObjectType } from '@/utils'
import {
  arrayUnique,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const IsValidContentType =
  (contentTypes: string[], errorMessage: string): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsValidContentType',
      target: object.constructor,
      constraints: [],
      options: {
        message: errorMessage,
      },
      validator: {
        validate(value: unknown): boolean {
          return !!contentTypes.find((f) => value === f)
        },
      },
    })
  }

export const IsPassword = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsPassword',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationTypeMessage.isPassword,
      },
      validator: {
        validate(value: string) {
          return RegexConstant.passwordFormat.test(value)
        },
      },
    })
  }
}

export const IsArrayUnique = (property?: string): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsArrayUnique',
      target: object.constructor,
      constraints: [],
      options: {
        message: ValidationLogicMessage.isArrayUnique,
      },
      validator: {
        validate(value: unknown): boolean {
          if (!Array.isArray(value)) return false
          const arrValue = property
            ? value
                .filter(
                  (entity: Record<string, unknown>) =>
                    typeof entity === 'object' &&
                    entity !== null &&
                    !entity.isDeleted,
                )
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                .map((e) => String(e[property as keyof typeof e]))
            : value

          return arrayUnique(arrValue)
        },
      },
    })
  }
}

export const IsLessOrEqual =
  (
    argument: string,
    validationOptions?: ValidationOptions,
  ): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsLessOrEqual',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.isLessOrEqual.replace(
          '$argument',
          'something to less or equal',
        ),
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType

          if (!(argument in targetObject)) return false

          const field2 = targetObject[argument] as number | undefined

          return (
            typeof value === 'number' &&
            typeof field2 === 'number' &&
            value <= field2
          )
        },
      },
    })
  }

export const IsGreaterOrEqual =
  (
    targetOptions: {
      targetFieldName: string
      skipIfNull?: boolean
      skipIfTargetValueNull?: boolean
    },
    validationOptions?: ValidationOptions,
  ): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsGreaterOrEqual',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.isGreaterOrEqual,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const { targetFieldName, skipIfNull, skipIfTargetValueNull } =
            targetOptions

          const targetObject = args.object as ObjectType
          if (!(targetFieldName in targetObject)) return false

          const targetValue = targetObject[targetFieldName] as
            | number
            | undefined

          if (
            (skipIfNull && value == undefined) ||
            (skipIfTargetValueNull && targetValue == undefined)
          ) {
            return true
          }

          return (
            typeof value === 'number' &&
            typeof targetValue === 'number' &&
            value >= targetValue
          )
        },
      },
    })
  }

export const IsLaterWithDateOrTimeOnly =
  (
    startTimeField: string,
    skipIfNull?: boolean,
    validationOptions?: ValidationOptions,
  ): PropertyDecorator =>
  (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsLaterWithDateOrTimeOnly',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.isLaterWithDateOrTimeOnly,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType

          if (!(startTimeField in targetObject)) return false

          const startTimeValue = targetObject[startTimeField] as
            | number
            | undefined

          if (skipIfNull && !value) return true

          return (
            typeof value === 'number' &&
            typeof startTimeValue === 'number' &&
            value >= startTimeValue
          )
        },
      },
    })
  }

export const IsEarlierWithDateOrTimeOnly = (
  targetOptions: {
    targetField: string
    targetFieldName?: string
    skipIfTargetValueNull?: boolean
    skipIfNull?: boolean
  },
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  const { targetField, targetFieldName, skipIfNull, skipIfTargetValueNull } =
    targetOptions
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'Earlier',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.timeEarlierThanField.replace(
          '$field',
          targetFieldName ?? targetField,
        ),
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType
          const targetValue = targetObject[targetField]
          if (
            (skipIfNull && value == undefined) ||
            (skipIfTargetValueNull && targetValue == undefined)
          ) {
            return true
          }

          return (
            typeof value === 'number' &&
            typeof targetValue === 'number' &&
            value < targetValue
          )
        },
      },
    })
  }
}

export const IsLaterWithDateTimeConcat = (
  startDateField: string,
  startTimeField: string,
  endDateField: string,
  endTimeField: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsLaterWithDateTimeConcat',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.isLaterWithDateOrTimeOnly,
      },
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType

          const startDateValue = new Date(
            targetObject[startDateField] as string | number | Date,
          )
          const endDateValue = new Date(
            targetObject[endDateField] as string | number | Date,
          )

          if (startDateValue < endDateValue) {
            return true
          }
          if (startDateValue > endDateValue) {
            return false
          }

          return args.object[startTimeField] <= args.object[endTimeField]
        },
      },
    })
  }
}

export const IsConstraintField = (
  fieldConstraint: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsConstraintField',
      target: object.constructor,
      constraints: [fieldConstraint],
      options: {
        ...validationOptions,
        message: ValidationTypeMessage.isNotEmpty.replace(
          '$field',
          fieldConstraint,
        ),
      },
      validator: {
        validate(_value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType
          return (
            targetObject[fieldConstraint] !== undefined &&
            targetObject[fieldConstraint] !== null
          )
        },
      },
    })
  }
}

export const IsUntilCurrentTime = (
  fieldDateCompare?: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsUntilCurrentTime',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.untilCurrentTime,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const now = toZonedTime(
            new Date(),
            AppConstant.locationMomentTimezone,
          )
          const dateString = format(now, 'yyyy-MM-dd')
          const timeString = format(now, 'HH:mm')

          if (!fieldDateCompare) {
            const fieldDateValue = new Date(value as string | number | Date)
              .toISOString()
              .split('T')[0]

            return fieldDateValue <= dateString
          }

          const targetObject = args.object as ObjectType
          const fieldDateCompareValue = new Date(
            targetObject[fieldDateCompare] as string | number | Date,
          )
            .toISOString()
            .split('T')[0]

          if (fieldDateCompareValue < dateString) {
            return true
          }

          return typeof value === 'string' && value <= timeString
        },
      },
    })
  }
}

export const IsEmailMatchWith = (
  field: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'IsEmailMatchWith',
      target: object.constructor,
      constraints: [],
      options: {
        ...validationOptions,
        message: ValidationLogicMessage.emailMatchWith,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const targetObject = args.object as ObjectType
          const data = targetObject[field]

          return typeof data === 'string' && data === value
        },
      },
    })
  }
}
