import { DynamicModule } from '@nestjs/common'
import { AsyncLocalStorage } from 'async_hooks'
import { AsyncRequestContext } from './async-context-request.service'
import { AsyncContextModuleOptions } from '@/utils'

export class AsyncRequestContextModule {
  static forRoot(options?: AsyncContextModuleOptions): DynamicModule {
    const isGlobal = options?.isGlobal ?? true
    const asyncLocalStorageInstance =
      options?.asyncLocalStorageInstance ?? new AsyncLocalStorage()

    return {
      module: AsyncRequestContextModule,
      global: isGlobal,
      providers: [
        {
          provide: AsyncRequestContext,
          useValue: new AsyncRequestContext(asyncLocalStorageInstance),
        },
      ],
      exports: [AsyncRequestContext],
    }
  }
}
