import { CustomConfig } from '@/configs'
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@orm/client'

const { host, port, user, password, name } = CustomConfig().database

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  private prisma: PrismaClient
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memoryHealthIndicator: MemoryHealthIndicator,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {
    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database: name,
      connectionLimit: 5,
    })
    this.prisma = new PrismaClient({
      adapter,
    })
  }

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          threshold: 250 * 1024 * 1024 * 1024,
        }),
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 300 * 1024 * 1024),
      () =>
        this.prismaHealthIndicator.pingCheck('database', this.prisma, {
          timeout: 10000,
        }),
    ])
  }
}
