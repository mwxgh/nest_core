import {
  HttpExceptionOptions,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { FirebaseService } from '@/shared/firebase/firebase.service'
import { LoginDto, SignupDto } from './dto/auth.dto'
import { UserRole } from '@prisma'

@Injectable()
export class AuthService {
  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { uid, email } = await this.firebaseService.verifyIdToken(
        loginDto.firebaseUid,
      )

      if (!uid) {
        throw new UnauthorizedException('Invalid credentials')
      }

      const user = await this.userService.findWhere({
        email,
      })

      return user
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid credentials',
        error as HttpExceptionOptions,
      )
    }
  }

  async signup(signupDto: SignupDto) {
    const { email, password, firstName, lastName } = signupDto
    try {
      const firebaseUser = await this.firebaseService.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      })

      await this.firebaseService.setCustomUserClaims(firebaseUser.uid, {
        role: UserRole.USER,
      })

      return await this.userService.create({
        username: email.split('@')[0],
        firstName,
        lastName,
        email,
        firebaseUid: firebaseUser.uid,
      })
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid credentials',
        error as HttpExceptionOptions,
      )
    }
  }
}
