import { BadRequestException } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

export class CannotCreateOrUpdateException extends BadRequestException {
  constructor(field: string, error?: string) {
    super(
      ValidationLogicMessage.cannotCreateOrUpdate.replace('$field', field),
      error,
    )
  }
}
