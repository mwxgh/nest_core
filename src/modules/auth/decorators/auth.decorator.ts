import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard'
import { ROLES } from '@/constants'
import { FirebaseAuthGuard } from '../guards/firebase-auth.guard'
import { RoleType } from '@orm/enums'

export const Auth = (...roles: RoleType[]) => {
  return applyDecorators(
    SetMetadata(ROLES, roles),
    UseGuards(FirebaseAuthGuard, RolesGuard),
  )
}
