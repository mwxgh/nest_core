import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ToLowerCase, ToUpperCase } from './transform.decorator'
import {
  IsNotEmpty,
  IsNullable,
  IsString,
  IsUndefinable,
  MaxLength,
  MinLength,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IStringFieldOptions } from '@/utils'

export const StringField = (
  options: ApiPropertyCommonOptions & IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators = [Type(() => String)]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    const option = { each: options.each }

    if (options.messageIsNotEmpty) {
      Object.assign(option, { message: options.messageIsNotEmpty })
    }

    decorators.push(IsNotEmpty(option))
  }

  decorators.push(IsString({ each: options.each }))

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    )
  }

  if (options.minLength) {
    decorators.push(MinLength(options.minLength, { each: options.each }))
  }

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }))
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase())
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase())
  }

  return applyDecorators(...decorators)
}

export const StringFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, nullable: true, ...options }),
  )
}
