import { BadRequestException } from '@nestjs/common'
import { ValidationCustomLogicMessage } from '@/messages'

export class SignUpFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationCustomLogicMessage.signUpFail, error)
  }
}
