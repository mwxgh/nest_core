import { getVariableName } from '@/utils'
import { ApiProperty } from '@nestjs/swagger'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumAllowedTypes } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface'

export const ApiBooleanProperty = (
  options: ApiPropertyCommonOptions = {},
): PropertyDecorator => {
  return ApiProperty({ type: Boolean, ...options })
}

export const ApiBooleanPropertyOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> = {},
): PropertyDecorator => {
  return ApiBooleanProperty({ required: false, ...options })
}

export const ApiUUIDProperty = (
  options: ApiPropertyCommonOptions & Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  return ApiProperty({
    type: options.each ? [String] : String,
    format: 'uuid',
    isArray: options.each,
    ...options,
  })
}

export const ApiUUIDPropertyOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'format' | 'required'> &
    Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  return ApiUUIDProperty({ required: false, ...options })
}

export const ApiEnumProperty = <TEnum>(
  getEnum: () => TEnum,
  options: ApiPropertyCommonOptions & Partial<{ each: boolean }> = {},
): PropertyDecorator => {
  const enumValue = getEnum() as EnumAllowedTypes

  return ApiProperty({
    isArray: options.each,
    enum: enumValue,
    enumName: getVariableName(getEnum),
    ...options,
  })
}

export const ApiEnumPropertyOptional = <TEnum>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> & {
    each?: boolean
  } = {},
): PropertyDecorator => {
  return ApiEnumProperty(getEnum, { required: false, ...options })
}
