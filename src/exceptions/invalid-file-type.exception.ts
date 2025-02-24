import { BadRequestException } from '@nestjs/common'
import { ValidationCustomLogicMessage } from '@/messages'

export class InvalidFileTypeException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationCustomLogicMessage.invalidFileType, error)
  }
}
