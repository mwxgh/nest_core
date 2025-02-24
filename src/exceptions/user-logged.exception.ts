import { UnauthorizedException } from '@nestjs/common'
import { ValidationCustomLogicMessage } from '@/messages'

export class UserLoggedException extends UnauthorizedException {
  constructor(error?: string) {
    super(ValidationCustomLogicMessage.forceLogoutWhenLoginLater, error)
  }
}
