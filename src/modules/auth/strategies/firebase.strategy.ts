import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-firebase-jwt'
import { UserService } from '@/modules/user/user.service'
import { FirebaseService } from '@/shared/firebase/firebase.service'
import { jwtFirebaseStrategyConfig } from '@/configs'

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-jwt',
) {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
  ) {
    super(jwtFirebaseStrategyConfig)
  }

  async validate(token: string) {
    try {
      const decodedToken = await this.firebaseService.verifyIdToken(token)
      console.log(decodedToken, 'decodedToken___________')
      // email_verified, name, picture
      const { uid, email, role } = decodedToken

      if (!email) {
        throw new UnauthorizedException('Firebase token does not contain email')
      }

      const user = await this.userService.findWhere({
        firebaseUid: uid,
        email,
        role,
      })

      return user
    } catch (error) {
      throw new UnauthorizedException(`Invalid Firebase token error : ${error}`)
    }
  }
}
