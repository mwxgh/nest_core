import { ROLES } from '@/constants'
import { IUser, RequestWithUser } from '@/utils'
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RoleType } from '@orm/enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const contextRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!contextRoles) return true

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user: IUser | undefined = request.user

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    if (!Array.isArray(user.roles) || user.roles.length === 0) {
      throw new ForbiddenException('User has no roles')
    }

    const userRoleNames = user.roles

    const hasRole = contextRoles.some((role) => userRoleNames.includes(role))

    if (!hasRole) {
      throw new ForbiddenException('User does not have required role')
    }

    return true
  }
}
