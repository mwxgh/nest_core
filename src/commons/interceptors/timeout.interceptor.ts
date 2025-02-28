import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common'
import { throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeout: number

  constructor(timeout: number | string) {
    this.timeout = typeof timeout === 'string' ? parseInt(timeout, 10) : timeout

    if (isNaN(this.timeout) || this.timeout <= 0) {
      throw new Error(`Invalid timeout value: ${timeout}`)
    }
  }

  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(this.timeout),
      catchError((err) =>
        err instanceof TimeoutError
          ? throwError(() => new RequestTimeoutException())
          : throwError(() => new Error(String(err))),
      ),
    )
  }
}
