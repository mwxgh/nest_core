import { UnauthorizedException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class UserLoggedException extends UnauthorizedException {
  constructor(error?: string) {
    super(ValidationLogicMessage.forceLogoutWhenLoginLater, error)
  }
}
