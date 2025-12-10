import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC } from '@/constants'
import { FirebaseAdminService } from '@/shared/firebase/firebase-admin.service'
import { UserService } from '@/modules/user/user.service'
import { Request } from 'express'

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private firebaseAdminService: FirebaseAdminService,
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
      const {
        email,
        uid,
        roles = [],
      } = await this.firebaseAdminService.verifyIdToken(token)

      const user = await this.userService.findWhere({
        email,
        firebaseUid: uid,
      })

      request.user = {
        ...user,
        roles: roles,
      }

      return true
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error}`)
    }
  }
}
