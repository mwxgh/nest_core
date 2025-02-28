import { applyDecorators } from '@nestjs/common'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { IsNullable, IsUndefinable } from './validator.decorator'
import { ToArray } from './transform.decorator'
import { ApiEnumProperty } from './property.decorator'
import { IFieldOptions } from '@/utils'

type IEnumFieldOptions = IFieldOptions

export const EnumField = <TEnum extends object>(
  getEnum: () => TEnum,
  options: ApiPropertyCommonOptions & IEnumFieldOptions = {},
): PropertyDecorator => {
  const enumValue = getEnum()
  const decorators = [IsNotEmpty(), IsEnum(enumValue, { each: options.each })]

  if (options.nullable) {
    decorators.push(
      IsNullable({ each: options.each }),
      IsOptional({ each: options.each }),
    )
  } else {
    decorators.push(IsNotEmpty({ each: options.each }))
  }

  if (options.each) {
    decorators.push(ToArray())
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
    )
  }

  return applyDecorators(...decorators)
}

export const EnumFieldOptional = <TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IEnumFieldOptions = {},
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    EnumField(getEnum, { required: false, ...options, nullable: true }),
  )
}
