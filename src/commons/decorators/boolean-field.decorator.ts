import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import {
  IsBoolean,
  IsNotEmpty,
  IsNullable,
  IsUndefinable,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils'

type IBooleanFieldOptions = IFieldOptions

export const BooleanField = (
  options: ApiPropertyCommonOptions & IBooleanFieldOptions = {},
): PropertyDecorator => {
  const decorators = [IsNotEmpty(), IsBoolean()]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }))
  }

  return applyDecorators(...decorators)
}

export const BooleanFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IBooleanFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    BooleanField({ required: false, ...options, nullable: true }),
  )
}
