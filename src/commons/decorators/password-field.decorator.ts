import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { applyDecorators } from '@nestjs/common'
import { IsNotEmpty } from 'class-validator'
import { StringField } from './string-field.decorator'
import { IsNullable, IsUndefinable } from './validator.decorator'
import { IStringFieldOptions } from '@/utils'

export const PasswordField = (
  options: ApiPropertyCommonOptions & IStringFieldOptions = {},
): PropertyDecorator => {
  const decorators = [StringField({ ...options, minLength: 6 }), IsNotEmpty()]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  return applyDecorators(...decorators)
}

export const PasswordFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    PasswordField({ required: false, ...options }),
  )
}
