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
import { Prisma, PrismaClient } from '@orm/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const { host, port, user, password, name } = CustomConfig().database

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database: name,
      connectionLimit: 5,
    })
    super({
      adapter,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    })
  }

  async onModuleInit() {
    this.$on('query' as never, (event: Prisma.QueryEvent) => {
      this.logger.log(
        `${LoggerConstant.queryPrefix} ${event.query} ${LoggerConstant.parameterPrefix} ${event.params}`,
        'PrismaClient',
      )
    })
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`Application is shutting down due to ${signal}`)
    await this.$disconnect()
  }
}
