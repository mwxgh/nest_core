import { BadRequestException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class SignUpFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationLogicMessage.signUpFail, error)
  }
}
