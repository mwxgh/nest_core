import { ROLES } from '@/constants'
import { RequestWithUser } from '@/utils'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from '@prisma'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    if (requiredRoles.includes(user.role)) {
      return true
    }

    throw new ForbiddenException(
      `Role ${user.role} is not authorized to access this resource`,
    )
  }
}
