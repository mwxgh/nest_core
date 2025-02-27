import { RegexConstant } from '@/constants'
import { ValidationLogicMessage, ValidationTypeMessage } from '@/messages'
import {
  arrayUnique,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'

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
      name: 'isPassword',
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

export const ArrayUnique = (property?: string): PropertyDecorator => {
  return (object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'arrayUnique',
      target: object.constructor,
      constraints: [],
      options: {
        message: ValidationLogicMessage.arrayUnique,
      },
      validator: {
        validate(value: unknown): boolean {
          if (!Array.isArray(value)) return false // Ensure value is an array

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

// export const IsLessOrEqual =
//   (argument: any, validationOptions?: ValidationOptions): PropertyDecorator =>
//   (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'LessOrEqual',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.isLessOrEqual.replace(
//           '$argument',
//           'something to less or equal',
//         ),
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const field2 = args.object[argument]

//           return value <= field2
//         },
//       },
//     })
//   }

// export const IsGreaterOrEqual =
//   (
//     targetOptions: {
//       targetFieldName: any
//       skipIfNull?: boolean
//       skipIfTargetValueNull?: boolean
//     },
//     validationOptions?: ValidationOptions,
//   ): PropertyDecorator =>
//   (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'GreaterOrEqual',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.isGreaterOrEqual,
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const { targetFieldName, skipIfNull, skipIfTargetValueNull } =
//             targetOptions
//           const targetValue = args.object[targetFieldName]

//           if (
//             (skipIfNull && value == undefined) ||
//             (skipIfTargetValueNull && targetValue == undefined)
//           ) {
//             return true
//           }

//           return value >= targetValue
//         },
//       },
//     })
//   }

// export const IsLaterWithDateOrTimeOnly =
//   (
//     startTimeField: any,
//     skipIfNull?: boolean,
//     validationOptions?: ValidationOptions,
//   ): PropertyDecorator =>
//   (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'Later',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.isLaterWithDateOrTimeOnly,
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const startTimeValue = args.object[startTimeField]
//           if (skipIfNull && value == undefined) {
//             return true
//           }

//           return value >= startTimeValue
//         },
//       },
//     })
//   }

// export const IsEarlierWithDateOrTimeOnly = (
//   targetOptions: {
//     targetField: any
//     targetFieldName?: any
//     skipIfTargetValueNull?: boolean
//     skipIfNull?: boolean
//   },
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   const { targetField, targetFieldName, skipIfNull, skipIfTargetValueNull } =
//     targetOptions
//   return (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'Earlier',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.timeEarlierThanField.replace(
//           '$field',
//           targetFieldName ?? targetField,
//         ),
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const targetValue = args.object[targetField]
//           if (
//             (skipIfNull && value == undefined) ||
//             (skipIfTargetValueNull && targetValue == undefined)
//           ) {
//             return true
//           }

//           return value < targetValue
//         },
//       },
//     })
//   }
// }

// export const IsLaterWithDateTimeConcat = (
//   startDateField: any,
//   startTimeField: any,
//   endDateField: any,
//   endTimeField: any,
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   return (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'LaterWithDateConcat',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.isLaterWithDateOrTimeOnly,
//       },
//       validator: {
//         validate(_value: any, args: any) {
//           const startDateValue = args.object[startDateField]
//           const endDateValue = args.object[endDateField]

//           if (startDateValue < endDateValue) {
//             return true
//           }
//           if (startDateValue > endDateValue) {
//             return false
//           }

//           return args.object[startTimeField] <= args.object[endTimeField]
//         },
//       },
//     })
//   }
// }

// export const IsConstraintField = (
//   fieldConstraint: string,
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   return (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'ConstraintField',
//       target: object.constructor,
//       constraints: [fieldConstraint],
//       options: {
//         ...validationOptions,
//         message: ValidationTypeMessage.isNotEmpty.replace(
//           '$field',
//           fieldConstraint,
//         ),
//       },
//       validator: {
//         validate(_value: any, args: any) {
//           return (
//             args.object[fieldConstraint] &&
//             args.object[fieldConstraint] !== null
//           )
//         },
//       },
//     })
//   }
// }

// export const IsUntilCurrentTime = (
//   fieldDateCompare?: string,
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   return (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'UntilCurrentTime',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.untilCurrentTime,
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const momentTimezone = moment().tz(AppConstant.locationMomentTimezone)
//           const dateString = momentTimezone.format('YYYY-MM-DD')
//           const timeString = momentTimezone.format('HH:mm')

//           if (!fieldDateCompare) {
//             const fieldDateValue = new Date(value).toISOString().split('T')[0]

//             return fieldDateValue <= dateString
//           }

//           const fieldDateCompareValue = new Date(args.object[fieldDateCompare])
//             .toISOString()
//             .split('T')[0]

//           if (fieldDateCompareValue < dateString) {
//             return true
//           }

//           return value <= timeString
//         },
//       },
//     })
//   }
// }

// export const IsEmailMatchWith = (
//   field: string,
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   return (object, propertyName: string) => {
//     registerDecorator({
//       propertyName,
//       name: 'EmailMatchWith',
//       target: object.constructor,
//       constraints: [],
//       options: {
//         ...validationOptions,
//         message: ValidationLogicMessage.emailMatchWith,
//       },
//       validator: {
//         validate(value: any, args: any) {
//           const data = args.object[field]

//           return data && data === value
//         },
//       },
//     })
//   }
// }
