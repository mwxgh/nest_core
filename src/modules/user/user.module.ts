import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { FirebaseModule } from '@/shared/firebase/firebase.module'

@Module({
  imports: [PrismaModule, FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
