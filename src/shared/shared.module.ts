import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { AsyncRequestContextModule } from './async-context-request'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    LoggerModule,
    HealthModule,
  ],
})
export class SharedModule {}
