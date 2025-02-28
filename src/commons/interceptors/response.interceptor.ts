import { ExceptionFilterType } from '@/utils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { tap } from 'rxjs/operators'

@Injectable()
export class ResponseLoggerInterceptor implements NestInterceptor {
  constructor(private readonly filterParam: ExceptionFilterType) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    const { logger, asyncRequestContext } = this.filterParam

    return next.handle().pipe(
      tap(() => {
        logger.log('SUCCESS', asyncRequestContext.getRequestIdStore())
        asyncRequestContext.exit()
      }),
    )
  }
}
