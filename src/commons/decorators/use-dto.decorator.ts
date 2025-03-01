import { AbstractEntity, Constructor } from '@/utils'
import { AbstractDto } from '../dtos'

export const UseDto = (
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator => {
  return (ctor) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctor.prototype.dtoClass = dtoClass
  }
}
