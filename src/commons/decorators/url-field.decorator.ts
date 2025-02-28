import { applyDecorators } from '@nestjs/common'
import { IsUrl } from 'class-validator'
import { IsNotEmpty, IsNullable, IsUndefinable } from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { StringField } from './string-field.decorator'
import { IStringFieldOptions } from '@/utils'

export const URLField = (
  options: ApiPropertyCommonOptions & IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    IsNotEmpty(),
    StringField(options),
    IsUrl({}, { each: true }),
  ]

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }))
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  return applyDecorators(...decorators)
}

export const URLFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    URLField({ required: false, ...options }),
  )
}
