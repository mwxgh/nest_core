import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from '@nestjs/common'
import { OnApplicationShutdown } from '@nestjs/common'
import { CustomConfig } from '@/configs'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { LoggerConstant } from '@/constants'
import { Prisma, PrismaClient } from '@prisma'

const { url } = CustomConfig().database

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'warn' | 'error'>
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super({
      datasources: {
        db: { url },
      },
      log: [
        {
          emit: 'event',
          level: 'query' as Prisma.LogLevel,
        },
      ],
    })
  }

  async onModuleInit() {
    await this.$connect()
    this.$on<'query'>('query', (event: Prisma.QueryEvent) => {
      return this.logger.log(
        `${LoggerConstant.queryPrefix} ${event.query} ${LoggerConstant.parameterPrefix} ${event.params}`,
        'PrismaService',
      )
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to ${signal}`)
    await this.$disconnect()
  }
}
