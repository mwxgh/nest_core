import { AbstractEntity, Constructor } from '@/utils/declare'
import { AbstractDto } from '../dtos'

// interface DtoClassConstructor {
//   new (...args: any[]): any
//   prototype: {
//     dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>
//   }
// }

export const UseDto = (
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (ctor: Function) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ctor.prototype.dtoClass = dtoClass
  }
}
