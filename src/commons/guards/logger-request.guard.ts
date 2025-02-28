import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import {
  buildLogParameters,
  createStore,
  ExceptionFilterType,
  ObjectType,
  RequestWithContextType,
} from '@/utils'
import { Request } from 'express'

@Injectable()
export class LoggerRequestGuard implements CanActivate {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let { logger, asyncRequestContext } = this.filterParam

    const req = context.switchToHttp().getRequest<Request>()

    const logContext = createStore(
      req as unknown as RequestWithContextType,
      asyncRequestContext,
    )

    const body: ObjectType =
      req.body && typeof req.body === 'object'
        ? (req.body as unknown as ObjectType)
        : {}
    const query: ObjectType =
      req.query && typeof req.query === 'object'
        ? (req.query as ObjectType)
        : {}

    const params = { ...body, ...query }

    logger.log(
      `[Params]: ${JSON.stringify(buildLogParameters(params))}`,
      logContext,
    )
    ;(logger as any) = (asyncRequestContext as any) = null

    return true
  }
}
