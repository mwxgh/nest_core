import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  PipeTransform,
} from '@nestjs/common'
import type { Type } from '@nestjs/common/interfaces'
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'
import { ErrorMessage } from '@/messages'

export const getSchema = (statusCode: string | number, message?: string) => {
  const code = statusCode as keyof typeof ErrorMessage

  return {
    schema: {
      type: 'object',
      example: {
        statusCode: statusCode,
        message: message ?? ErrorMessage[code],
      },
    },
    description: message ?? ErrorMessage[code],
  }
}

export const ApiValidateResponse: (options?: {
  description?: string
}) => MethodDecorator = (options?: { description?: string }) => {
  return applyDecorators(
    ApiUnprocessableEntityResponse({
      schema: {
        type: 'object',
        example: {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: ErrorMessage[HttpStatus.UNPROCESSABLE_ENTITY],
          details: [
            {
              property: 'username',
              message: 'username should not be empty',
            },
          ],
        },
      },
      description: options?.description,
    }),
  )
}

export const ApiBadRequestResponseWrap: (options?: {
  description?: string
  message?: string
}) => MethodDecorator = (options?: {
  description?: string
  message?: string
}) => {
  return applyDecorators(
    ApiBadRequestResponse({
      ...getSchema(HttpStatus.BAD_REQUEST, options?.message),
      description: options?.description,
    }),
  )
}

export const ApiAuth: (
  type?: Type<object>,
  options?: {
    summary: string
    description?: string
  },
  statusCode?: number,
) => MethodDecorator = (
  type?: Type<object>,
  options?: {
    summary: string
    description?: string
  },
  statusCode = HttpStatus.OK,
) => {
  const arrDecorator = [
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
    ApiOperation({ summary: options?.summary }),
  ]

  arrDecorator.push(
    ApiOkResponse({
      type: type,
      description: options?.description ?? 'OK',
    }),
  )

  return applyDecorators(...arrDecorator, HttpCode(statusCode))
}

export const ApiPublic: (
  type?: Type<object>,
  options?: {
    summary: string
    description?: string
  },
  statusCode?: number,
) => MethodDecorator = (
  type?: Type<object>,
  options?: {
    summary: string
    description?: string
  },
  statusCode = HttpStatus.OK,
) => {
  return applyDecorators(
    ApiOkResponse({
      type: type,
      description: options?.description ?? 'OK',
    }),
    ApiInternalServerErrorResponse({
      ...getSchema(HttpStatus.INTERNAL_SERVER_ERROR),
    }),
    ApiOperation({ summary: options?.summary }),
    HttpCode(statusCode),
  )
}

export const UUIDParam: (
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => ParameterDecorator = (
  property: string,
  ...pipes: (Type<PipeTransform> | PipeTransform)[]
) => {
  return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes)
}
