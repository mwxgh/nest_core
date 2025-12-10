import {
  EmailField,
  EnumFieldOptional,
  StringField,
  StringFieldOptional,
} from '@commons/decorators'
import { EntityConstant } from '@/constants'
import { RoleType, UserStatus } from '@orm/enums'

export class CreateUserDto {
  @StringField({ maxLength: EntityConstant.EntityUserNameLength })
  readonly name: string

  @EmailField({ maxLength: EntityConstant.EntityShortLength })
  readonly email: string

  @EnumFieldOptional(() => RoleType)
  readonly role?: RoleType

  @EnumFieldOptional(() => UserStatus)
  readonly status?: UserStatus

  @StringFieldOptional()
  readonly firebaseUid?: string
}
