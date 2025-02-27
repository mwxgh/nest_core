import { DefaultDirection, Direction } from '@/constants'
import { EnumFieldOptional } from '../decorators/enum-field.decorator'
import { NumberFieldOptional } from '../decorators/number-field.decorator'
import { StringFieldOptional } from '../decorators/string-field.decorator'
import { ToEscapeString } from '../decorators/transform.decorator'

export class PageOptionsDto {
  @EnumFieldOptional(() => Direction, {
    default: DefaultDirection,
  })
  readonly order: Direction = DefaultDirection

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 50,
    int: true,
  })
  readonly take: number = 50

  @StringFieldOptional()
  @ToEscapeString()
  readonly q?: string

  @StringFieldOptional()
  @ToEscapeString()
  readonly orderBy?: string
}
