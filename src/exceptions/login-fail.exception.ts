import { BadRequestException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class LoginFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationLogicMessage.loginFail, error)
  }
}
