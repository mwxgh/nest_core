import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import {
  IsDate,
  IsNotEmpty,
  IsNullable,
  IsUndefinable,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils'

export const DateField = (
  options: ApiPropertyCommonOptions & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [Type(() => Date)]

  if (options.nullable) {
    decorators.push(IsNullable(), IsOptional({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }))
  }

  decorators.push(
    IsDate(options),
    Transform(({ value }) => {
      if (!value) return null
      if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        value instanceof Date
      ) {
        const parsedDate = new Date(value)
        return isNaN(parsedDate.getTime()) ? null : parsedDate
      }
      return null
    }),
  )

  return applyDecorators(...decorators)
}

export const DateFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    DateField({ ...options, required: false, nullable: true }),
  )
}
