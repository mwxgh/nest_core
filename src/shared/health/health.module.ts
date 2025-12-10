import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { PrismaModule } from '@/modules/prisma/prisma.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {}
