import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { ErrorMessage } from '@/messages'
import {
  createStore,
  ExceptionFilterType,
  RequestWithContextType,
} from '@/utils'
import { Response } from 'express'
import { Prisma } from '@orm/client'

@Catch(Prisma.PrismaClientKnownRequestError, NotFoundException)
export class EntityNotfoundFilter implements ExceptionFilter<HttpException> {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  catch(_: HttpException, host: ArgumentsHost) {
    const { logger, asyncRequestContext } = this.filterParam

    const statusCode = HttpStatus.NOT_FOUND
    const req = host.switchToHttp().getRequest<RequestWithContextType>()
    const store = createStore(req, asyncRequestContext)

    logger.warn(ErrorMessage[statusCode], store)

    const response = host.switchToHttp().getResponse<Response>()

    asyncRequestContext.exit()

    return response.status(statusCode).send({
      statusCode,
      message: ErrorMessage[statusCode],
    })
  }
}
