import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'

@Catch(ForbiddenException)
export class ForbiddenFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam
    const statusCode = HttpStatus.FORBIDDEN

    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<Response>()

    asyncRequestContext.exit()

    return response.status(statusCode).send({
      statusCode,
      message:
        exception.message && exception.message !== 'Forbidden'
          ? exception.message
          : ErrorMessage[statusCode],
    })
  }
}
