import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { OnApplicationShutdown } from '@nestjs/common'
import config from '@/configs/config'

const { url } = config().database

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor() {
    super({
      datasources: {
        db: { url },
      },
    })
  }

  async onModuleInit() {
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
