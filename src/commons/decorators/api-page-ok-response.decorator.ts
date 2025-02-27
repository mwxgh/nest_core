import type { Type } from '@nestjs/common'
import { applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger'
import { PageDto } from '../dtos'

export const ApiPageOkResponse: <T extends Type<object>>(options: {
  type: T
  description?: string
  summary?: string
}) => MethodDecorator = <T extends Type<object>>(options: {
  type: T
  description?: string
  summary?: string
}) => {
  return applyDecorators(
    ApiExtraModels(PageDto),
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PageDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    }),
    ApiOperation({ summary: options.summary }),
  )
}
