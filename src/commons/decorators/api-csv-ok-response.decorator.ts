import type { Type } from '@nestjs/common'
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { getSchema } from './http.decorator'

export const ApiCsvOkResponse: <T extends Type<object>>(options: {
  type: T
  description?: string
  summary?: string
  example?: string
}) => MethodDecorator = <T extends Type<object>>(options: {
  type: T
  description?: string
  summary?: string
  example?: string
}) => {
  return applyDecorators(
    ApiExtraModels(options.type),
    ApiOkResponse({
      description: options.description,
      content: {
        'text/csv': {
          schema: {
            type: 'string',
          },
          example: options.example ?? `id, name, \n1, name1 \n2, name2`,
        },
      },
    }),
    ApiOperation({ summary: options.summary }),
    ApiUnauthorizedResponse({
      ...getSchema(HttpStatus.UNAUTHORIZED),
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      ...getSchema(HttpStatus.FORBIDDEN),
      description: 'User does not have permission to perform this action.',
    }),
    ApiInternalServerErrorResponse({
      ...getSchema(HttpStatus.INTERNAL_SERVER_ERROR),
      description: 'Internal Server Error',
    }),
    HttpCode(HttpStatus.OK),
  )
}
