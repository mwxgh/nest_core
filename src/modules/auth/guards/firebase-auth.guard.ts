import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC } from '@/constants'
import { FirebaseService } from '@/shared/firebase/firebase.service'
import { UserService } from '@/modules/user/user.service'
import { Request } from 'express'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private userService: UserService,
    private reflector: Reflector,
  ) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    try {
      const firebaseUid = token
      // const decodedToken = await this.firebaseService.getUser(token)

      // console.log(decodedToken, ' decodedToken_________________')

      const user = await this.userService.findWhere({
        firebaseUid,
        // email: decodedToken.email,
      })

      request.user = user

      return true
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error}`)
    }
  }
}
