import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { PageMetaDto } from './page-meta.dto'

export class PageDto<T> {
  @Expose()
  @ApiProperty({ isArray: true })
  readonly data: T[]

  @Expose()
  @ApiProperty()
  readonly meta: PageMetaDto

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data
    this.meta = meta
  }
}
