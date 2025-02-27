import { applyDecorators } from '@nestjs/common'
import { Transform, TransformFnParams, Type } from 'class-transformer'
import moment from 'moment'
import { RegexConstant } from '@/constants'
import {
  IsNotEmpty,
  IsNullable,
  IsTimeString,
  IsUndefinable,
} from './validator.decorator'
import {
  ApiProperty,
  ApiPropertyCommonOptions,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils/declare'

export type Time = `${number}:${number}`

export const TimeField = (
  options: ApiPropertyCommonOptions & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    Type(() => String),
    IsNotEmpty(),
    IsTimeString('HH:mm', RegexConstant.timeFormatHHmm),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: 'string', ...options }))
  }

  decorators.push(
    Transform(({ value }: TransformFnParams): string | undefined => {
      return value && typeof value === 'string'
        ? moment(`2000-01-01 ${value}`).format('HH:mm:ss')
        : undefined
    }),
  )

  return applyDecorators(...decorators)
}

export const TimeFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    TimeField({ ...options, required: false }),
  )
}
