import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const statusCode = HttpStatus.BAD_REQUEST

    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<Response>()
    asyncRequestContext.exit()

    return response.status(statusCode).json({
      statusCode,
      message:
        typeof exception.message === 'string' &&
        exception.message !== 'Bad Request'
          ? exception.message
          : ErrorMessage[statusCode],
    })
  }
}
