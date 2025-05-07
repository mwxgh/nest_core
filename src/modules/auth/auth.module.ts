import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { FirebaseStrategy } from './strategies/firebase.strategy'
import { UserService } from '../user/user.service'
import { FirebaseModule } from '@/shared/firebase/firebase.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy, UserService],
})
export class AuthModule {}
