import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard'
import { UserRole } from '@prisma'

export const Auth = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(FirebaseAuthGuard, RolesGuard),
  )
