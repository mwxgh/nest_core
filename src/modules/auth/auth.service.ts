import {
  HttpExceptionOptions,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../user/user.service'
import { FirebaseAdminService } from '@/shared/firebase/firebase-admin.service'
import { LoginDto, LoginResponseDto, SignupDto } from './dto/auth.dto'
import { UserRole } from '@prisma'
import { FirebaseClientService } from '@/shared/firebase/firebase-client.service'

@Injectable()
export class AuthService {
  constructor(
    private firebaseAdminService: FirebaseAdminService,
    private firebaseClientService: FirebaseClientService,
    private userService: UserService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, firstName, lastName } = signupDto
    try {
      const firebaseUser = await this.firebaseAdminService.createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      })

      await this.firebaseAdminService.setCustomUserClaims(firebaseUser.uid, {
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

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto
    return await this.firebaseClientService.signIn(email, password)
  }
}
