import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus, UnprocessableEntityException } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { isEmpty } from 'lodash'
import { Attributes, ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'

type IndexedValidationError = {
  index?: number
} & ValidationError

type EntityName = keyof typeof Attributes

@Catch(UnprocessableEntityException)
export class UnprocessableFilter implements ExceptionFilter<UnprocessableEntityException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.UNPROCESSABLE_ENTITY
    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<Response>()
    asyncRequestContext.exit()

    const res = exception.getResponse() as
      | { message: ValidationError[]; error: string }
      | undefined

    if (!res?.message) {
      return response.status(statusCode).send({
        statusCode,
        message: ErrorMessage[statusCode],
        details: [],
      })
    }

    const validationErrors = res.message
    const messages = this.validationFilter(validationErrors)

    return response.status(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
      details: messages,
    })
  }

  private validationFilter(
    validationErrors: IndexedValidationError[],
  ): object[] {
    return validationErrors.map((error) => {
      const { property, constraints, contexts, children, target, index } = error

      if (!constraints && children && !isEmpty(children)) {
        return {
          index,
          property,
          message: this.validationFilter(children as IndexedValidationError[]),
        }
      }

      const { message } = this.buildErrorMessage(
        property,
        constraints ?? {},
        contexts ?? {},
        target ?? {},
      )

      return {
        index,
        property,
        message,
      }
    })
  }

  private buildErrorMessage(
    property: string,
    constraints: Record<string, string>,
    contexts: Record<string, unknown> | undefined,
    target: object,
  ) {
    const key = Object.keys(constraints)[0] ?? 'default'
    const attribute = this.getAttributeName(property, target)
    const message = this.formatErrorMessage(
      constraints[key] ?? 'Invalid value',
      attribute,
      contexts?.[key] && typeof contexts[key] === 'object'
        ? (contexts[key] as { value?: unknown }).value
        : undefined,
    )

    return { key, message }
  }

  private getAttributeName(property: string, target: object): string {
    const entityConstructor = (
      target as { constructor?: { entity?: EntityName } }
    )?.constructor
    const entityName = entityConstructor?.entity

    if (!entityName || !(entityName in Attributes)) {
      return property
    }

    const attributes = Attributes[entityName] as Record<string, unknown>
    const attributeName = attributes[property]

    return typeof attributeName === 'string' ? attributeName : property
  }

  private formatErrorMessage(
    message: string,
    attribute: string,
    value?: unknown,
  ): string {
    let formattedMessage = message.replace('$field', attribute)

    // ✅ Check if value is a safe primitive before replacing `$1`
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      formattedMessage = formattedMessage.replace('$1', String(value))
    }

    return formattedMessage
  }
}
