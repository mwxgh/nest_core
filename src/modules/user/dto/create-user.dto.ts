import { UserRole, UserStatus } from '@prisma/client'
import { EnumField, EnumFieldOptional, StringField } from '@/commons/decorators'
import { EntityConstant } from '@/constants'

export class CreateUserDto {
  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly firstName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly lastName: string

  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly username: string

  @StringField({ maxLength: EntityConstant.EntityShortLength })
  readonly email: string

  @EnumField(() => UserRole)
  readonly role: UserRole

  @EnumFieldOptional(() => UserStatus)
  readonly status: UserStatus
}
