import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'

@Injectable()
export class PositiveNumberPipe implements PipeTransform<string, number> {
  transform(value: unknown) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new NotFoundException()
    }

    const val = Number(value)

    if (isNaN(val) || val < 0) {
      throw new NotFoundException()
    }

    return val
  }
}
