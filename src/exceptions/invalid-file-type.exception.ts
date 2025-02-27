import { BadRequestException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class InvalidFileTypeException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationLogicMessage.invalidFileType, error)
  }
}
