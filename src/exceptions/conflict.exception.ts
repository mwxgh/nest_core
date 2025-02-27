import { ConflictException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class CustomConflictException extends ConflictException {
  constructor(field: string, error?: string) {
    super(ValidationLogicMessage.isConflict.replace('$field', field), error)
  }
}
