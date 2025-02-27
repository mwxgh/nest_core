import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ValidationLogicMessage } from '@/messages'

@Injectable()
export class StringLengthPipe implements PipeTransform<string> {
  private readonly length: number
  private readonly propertyName: string

  constructor(options: { length: number; propertyName: string }) {
    this.length = options.length
    this.propertyName = options.propertyName
  }

  transform(value: string) {
    let msg = ''

    if (value.length < this.length) {
      msg = ValidationLogicMessage.minLength
    }

    if (value.length > this.length) {
      msg = ValidationLogicMessage.maxLength
    }

    if (msg) {
      throw new BadRequestException(
        msg
          .replace('$field', this.propertyName)
          .replace('$1', this.length.toString()),
      )
    }

    return value
  }
}
