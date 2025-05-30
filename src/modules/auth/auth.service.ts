import {
  HttpExceptionOptions,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { FirebaseService } from '@/shared/firebase/firebase.service'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { uid } = await this.firebaseService.verifyIdToken(
        loginDto.firebaseToken,
      )

      if (!uid) {
        throw new UnauthorizedException('Invalid credentials')
      }

      const user = await this.userService.findWhere({
        firebaseUid: uid,
      })

      if (!user) {
        throw new UnauthorizedException('User Not found')
      }

      await this.firebaseService.setCustomUserClaims(user.firebaseUid ?? '', {
        role: user.role,
      })
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid credentials',
        error as HttpExceptionOptions,
      )
    }
  }
}
