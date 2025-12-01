import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter<UnauthorizedException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(_: UnauthorizedException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.UNAUTHORIZED
    logger.error(
      ErrorMessage[statusCode],
      asyncRequestContext.getRequestIdStore(),
    )

    const response = host.switchToHttp().getResponse<Response>()
    asyncRequestContext.exit()

    return response.status(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
    })
  }
}
