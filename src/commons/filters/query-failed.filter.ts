import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import { ExceptionFilterType } from '@/utils'
import { Response } from 'express'
import { Prisma } from 'prisma/generated'

@Catch(Prisma.PrismaClientKnownRequestError)
export class QueryFailedFilter implements ExceptionFilter {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(
    exception: Prisma.PrismaClientKnownRequestError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const { logger, asyncRequestContext } = this.filterParam
    const response = host.switchToHttp().getResponse<Response>()

    const statusCode =
      exception.code === 'P2002'
        ? HttpStatus.CONFLICT
        : HttpStatus.INTERNAL_SERVER_ERROR

    logger.error(
      `Prisma Query Error: ${exception.message}`,
      asyncRequestContext.getRequestIdStore(),
    )

    const errorMessage =
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : JSON.stringify(exception)

    logger.error(errorMessage, asyncRequestContext.getRequestIdStore())

    asyncRequestContext.exit()

    return response.status(statusCode).json({
      statusCode,
      message: ErrorMessage[statusCode],
    })
  }
}
