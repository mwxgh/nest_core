import { AbstractDto, PageDto, PageMetaDto } from '@commons/dtos'
import { UserRole } from '@prisma/client'
import { compact, map } from 'lodash'
import type { Logger } from 'winston'
import { AsyncLocalStorage } from 'async_hooks'
import { AsyncRequestContext } from '@/shared/async-context-request'

export type ObjectType = Record<string, unknown>

export interface StoreContextType {
  contextId?: string
  ip?: string
  endpoint?: string
  device?: string
  domain?: string
  userId?: number
  method?: string
}

export interface ExceptionFilterType {
  asyncRequestContext: AsyncRequestContext
  logger: Logger
}

export interface AsyncContextModuleOptions {
  isGlobal?: boolean
  asyncLocalStorageInstance?: AsyncLocalStorage<StoreContextType>
}

export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
  ...arguments_: Arguments
) => T
export interface User {
  id: number
  role: UserRole
  email?: string
}

export interface RequestWithUser extends Request {
  user?: User
}

export type RequestWithContextType = RequestWithUser & {
  raw?: {
    url?: string
  }
  ip?: string
  originalUrl?: string
  hostname?: string
}

export interface IFieldOptions {
  each?: boolean
  swagger?: boolean
  nullable?: boolean
  groups?: string[]
  message?: string | undefined
}

export type IStringFieldOptions = {
  minLength?: number
  maxLength?: number
  toLowerCase?: boolean
  toUpperCase?: boolean
  messageIsNotEmpty?: string
} & IFieldOptions

export type IArrayFieldOptions = {
  minSize?: number
  maxSize?: number
  isArrayUnique?: string
} & IFieldOptions

export type INumberFieldOptions = {
  min?: number
  max?: number
  int?: boolean
  isPositive?: boolean
} & IFieldOptions

export interface IAbstractEntity<DTO, O = never> {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  toDto(options?: O): DTO
}

export abstract class AbstractEntity<DTO = unknown, O = never>
  implements IAbstractEntity<DTO, O>
{
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date

  private dtoClass?: new (entity: AbstractEntity, options?: O) => DTO

  toDto(options?: O): DTO {
    if (!this.dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) to call the toDto function`,
      )
    }

    return new this.dtoClass(this, options)
  }
}

export abstract class AbstractEntityWithCU<
  DTO = unknown,
  O = never,
> extends AbstractEntity<DTO, O> {
  createdBy?: number
  updatedBy?: number
}

declare global {
  interface Array<T> {
    toDtos<Dto extends AbstractDto>(this: T[], options?: unknown): Dto[]

    toPageDto<Dto extends AbstractDto>(
      this: T[],
      pageMetaDto: PageMetaDto,
      options?: unknown,
    ): PageDto<Dto>
  }
}

Array.prototype.toDtos = <
  Entity extends AbstractEntityWithCU<Dto>,
  Dto extends AbstractDto,
>(
  options?: unknown,
): Dto[] =>
  compact(
    map<Entity, Dto>(this as unknown as Entity[], (item) =>
      item.toDto(options as never),
    ),
  )

Array.prototype.toPageDto = (pageMetaDto: PageMetaDto, options?: unknown) =>
  new PageDto(
    (this as unknown as AbstractEntityWithCU<AbstractDto>[]).toDtos(options),
    pageMetaDto,
  )

export const omitTimeStampFields = <T extends object>(data: T): Partial<T> => {
  const omittedKeys: (keyof T)[] = [
    'createdAt' as keyof T,
    'updatedAt' as keyof T,
    'deletedAt' as keyof T,
    'createdBy' as keyof T,
    'updatedBy' as keyof T,
  ]

  return Object.fromEntries(
    Object.entries(data).filter(
      ([key]) => !omittedKeys.includes(key as keyof T),
    ),
  ) as Partial<T>
}
