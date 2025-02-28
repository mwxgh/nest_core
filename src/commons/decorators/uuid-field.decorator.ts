import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { IsUUID } from 'class-validator'
import { ApiUUIDProperty } from './property.decorator'
import { ToArray } from './transform.decorator'
import { IsNotEmpty, IsNullable, IsUndefinable } from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils'

export const UUIDField = (
  options: ApiPropertyCommonOptions & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    Type(() => String),
    IsNotEmpty(),
    IsUUID('4', { each: options.each }),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiUUIDProperty(options))
  }

  if (options.each) {
    decorators.push(ToArray())
  }

  return applyDecorators(...decorators)
}

export const UUIDFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    UUIDField({ required: false, ...options }),
  )
}
