import { BadRequestException } from '@nestjs/common'
import { ValidationCustomLogicMessage } from '@/messages'

export class LoginFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationCustomLogicMessage.loginFail, error)
  }
}
