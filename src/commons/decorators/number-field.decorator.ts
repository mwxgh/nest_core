import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNullable,
  IsNumber,
  IsPositive,
  IsUndefinable,
  Max,
  Min,
} from './validator.decorator'
import { IArrayFieldOptions, INumberFieldOptions } from '@/utils'

export const NumberField = (
  options: ApiPropertyCommonOptions &
    INumberFieldOptions &
    IArrayFieldOptions = {},
): PropertyDecorator => {
  const decorators = [Type(() => Number)]

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }))
  }

  if (options.each) {
    decorators.push(IsArray())

    if (options.minSize) {
      decorators.push(ArrayMinSize(options.minSize))
    }

    if (options.maxSize) {
      decorators.push(ArrayMaxSize(options.maxSize))
    }
  }

  if (options.int) {
    /**
     * Use int = true when you specifically require an integer value.
     */
    decorators.push(IsInt({ each: options.each }))
  } else {
    /**
     * Use int = false when you need to accept both integer and floating-point numbers.
     */
    decorators.push(IsNumber({ each: options.each }))
  }

  if (typeof options.min === 'number') {
    decorators.push(
      Min(options.min, {
        message: options.message ?? `$field must be greater than $1`,
        each: options.each,
      }),
    )
  }

  if (typeof options.max === 'number') {
    decorators.push(
      Max(options.max, {
        message: options.message ?? `$field must be less than $1`,
        each: options.each,
      }),
    )
  }

  if (options.isPositive) {
    decorators.push(
      IsPositive({
        message: 'enter an unsigned integer',
        each: options.each,
      }),
    )
  }

  return applyDecorators(...decorators)
}

export const NumberFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    INumberFieldOptions &
    IArrayFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    NumberField({ required: false, nullable: true, ...options }),
  )
}
