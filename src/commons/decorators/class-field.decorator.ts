import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDefined, IsOptional, ValidateNested } from 'class-validator'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNullable,
  IsUndefinable,
} from './validator.decorator'
import { ApiPropertyCommonOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { IArrayFieldOptions } from '@/utils/declare'
import { ArrayUnique } from './validator.custom.decorator'

export const ClassField = (
  options: ApiPropertyCommonOptions & IArrayFieldOptions = {},
): PropertyDecorator => {
  const decorators: PropertyDecorator[] = [
    ValidateNested({ each: options.each }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Type(options.type as any),
    options.arrayUnique ? ArrayUnique(options.arrayUnique) : undefined,
    options.isArray ? IsArray() : undefined,
    options.minSize ? ArrayMinSize(options.minSize) : undefined,
    options.maxSize ? ArrayMaxSize(options.maxSize) : undefined,
    ...(options.nullable
      ? [IsNullable(), IsOptional()]
      : [IsNotEmpty({ each: options.each })]),
    options.required ? IsDefined() : undefined,
    options.swagger !== false
      ? ApiProperty({ isArray: true, ...options })
      : undefined,
  ].filter(Boolean) as PropertyDecorator[]

  return applyDecorators(...decorators)
}

export const ClassFieldOptional = (
  options: Omit<ApiPropertyCommonOptions, 'type' | 'required'> &
    IArrayFieldOptions,
): PropertyDecorator => {
  return applyDecorators(
    IsUndefinable(),
    ClassField({ ...options, required: false }),
  )
}
