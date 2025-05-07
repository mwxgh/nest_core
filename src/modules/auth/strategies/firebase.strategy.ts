import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-firebase-jwt'
import { UserService } from '@/modules/user/user.service'
import { FirebaseAdminService } from '@/shared/firebase/firebase-admin.service'
import { jwtFirebaseStrategyConfig } from '@/configs'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-jwt',
) {
  constructor(
    private userService: UserService,
    private firebaseAdminService: FirebaseAdminService,
  ) {
    super(jwtFirebaseStrategyConfig)
  }

  async validate(token: string) {
    try {
      const { uid, email } =
        await this.firebaseAdminService.verifyIdToken(token)

      if (!email) {
        throw new UnauthorizedException('Firebase token does not contain email')
      }

      return await this.userService.findWhere({
        firebaseUid: uid,
        email,
      })
    } catch (error) {
      throw new UnauthorizedException(`Invalid Firebase token error : ${error}`)
    }
  }
}
