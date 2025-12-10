import { SetMetadata } from '@nestjs/common'
import { ROLES } from '@/constants'
import { RoleType } from '@orm/client'

export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES, roles)
