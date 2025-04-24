import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { AsyncRequestContextModule } from './async-context-request'
import { LoggerModule } from './logger/logger.module'
import { FirebaseModule } from './firebase/firebase.module'

@Module({
  imports: [
    AsyncRequestContextModule.forRoot({ isGlobal: true }),
    LoggerModule,
    HealthModule,
    FirebaseModule,
  ],
})
export class SharedModule {}
