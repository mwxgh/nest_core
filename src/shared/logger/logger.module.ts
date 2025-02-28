import { Module } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { format, transports } from 'winston'
import { AppConstant } from '@/constants/app.constant'
import {
  AsyncRequestContext,
  AsyncRequestContextModule,
} from '../async-context-request'
import { loggerFormat } from './logger.format'
import { QueryLogger } from './query.logger'
import config from '@/configs/config'

const { env, timezone } = config().app

const formatted = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: timezone,
  })
}

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [AsyncRequestContextModule],
      useFactory: (asyncContext: AsyncRequestContext) => ({
        transports: [
          new transports.Console({
            silent: env === AppConstant.test,
            format: format.combine(
              format.timestamp({ format: formatted }),
              loggerFormat(asyncContext),
            ),
          }),
        ],
      }),
      inject: [AsyncRequestContext],
    }),
  ],
  providers: [QueryLogger],
  exports: [QueryLogger],
})
export class LoggerModule {}
