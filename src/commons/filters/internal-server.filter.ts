import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'

@Catch()
export class InternalServerFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: TypeError, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    const response = host.switchToHttp().getResponse<Response>()

    const errorMessage =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : JSON.stringify(exception)

    logger.error(errorMessage, null, asyncRequestContext.getRequestIdStore())

    const error = {
      statusCode,
      message:
        exception.message && exception.message !== 'Internal Server'
          ? exception.message
          : ErrorMessage[statusCode],
    }

    asyncRequestContext.exit()

    return response.status(statusCode).send(error)
  }
}
