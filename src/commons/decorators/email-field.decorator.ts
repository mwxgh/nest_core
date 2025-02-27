import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { applyDecorators } from '@nestjs/common'
import { IsEmail } from 'class-validator'
import { StringField } from './string-field.decorator'
import { IsUndefinable } from './validator.decorator'
import { IStringFieldOptions } from '@/utils/declare'

export const EmailField = (
  options: ApiPropertyCommonOptions & IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    StringField({ toLowerCase: true, ...options }),
    IsEmail({}, { message: 'Please enter a valid email address' }),
  )
}

export const EmailFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, nullable: true, ...options }),
  )
}
