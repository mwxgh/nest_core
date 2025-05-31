import { SetMetadata } from '@nestjs/common'
import { ROLES } from '@/constants'
import { UserRole } from '@prisma'

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES, roles)
