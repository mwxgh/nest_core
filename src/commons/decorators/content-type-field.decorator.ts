import { applyDecorators } from '@nestjs/common'
import { IsValidContentType } from './validator.custom.decorator'

export const ContentTypeField = (
  contentType: string[],
  errorMessage: string,
): PropertyDecorator => {
  return applyDecorators(IsValidContentType(contentType, errorMessage))
}
