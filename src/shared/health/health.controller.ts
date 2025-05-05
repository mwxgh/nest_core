import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus'
import { PrismaClient } from 'generated'

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  private prisma: PrismaClient
  constructor(
    private healthCheckService: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private prismaHealthIndicator: PrismaHealthIndicator,
  ) {
    this.prisma = new PrismaClient()
  }

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
      () =>
        this.memoryHealthIndicator.checkRSS('memory_rss', 300 * 1024 * 1024),
      () =>
        this.prismaHealthIndicator.pingCheck('database', this.prisma, {
          timeout: 1000,
        }),
    ])
  }
}
