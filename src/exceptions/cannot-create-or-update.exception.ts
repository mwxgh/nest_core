import { BadRequestException } from '@nestjs/common'
import { ValidationCustomLogicMessage } from '@/messages'

export class CannotCreateOrUpdateException extends BadRequestException {
  constructor(field: string, error?: string) {
    super(
      ValidationCustomLogicMessage.cannotCreateOrUpdate.replace(
        '$field',
        field,
      ),
      error,
    )
  }
}
