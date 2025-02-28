import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import {
  IsJSON,
  IsNotEmpty,
  IsNullable,
  IsUndefinable,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils'

export const JSONField = (
  options: ApiPropertyCommonOptions & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = []

  if (options.nullable) {
    decorators.push(IsNullable(), IsOptional({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: 'string', ...options }))
  }

  decorators.push(IsJSON(options))

  return applyDecorators(...decorators)
}

export const JSONFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    JSONField({ ...options, required: false, nullable: true }),
  )
}
