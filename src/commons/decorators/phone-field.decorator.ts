import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ToPhoneNumberSerializer } from './transform.decorator'
import {
  IsNotEmpty,
  IsNullable,
  IsPhoneNumber,
  IsUndefinable,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IFieldOptions } from '@/utils/declare'

export const PhoneField = (
  options: ApiPropertyCommonOptions & IFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    IsNotEmpty(),
    IsPhoneNumber({ region: 'VN' }),
    ToPhoneNumberSerializer(),
  ]

  if (options.nullable) {
    decorators.push(IsNullable())
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }))
  }

  return applyDecorators(...decorators)
}

export const PhoneFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    PhoneField({ required: false, ...options }),
  )
}
