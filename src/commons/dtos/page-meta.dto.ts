import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import type { PageOptionsDto } from './page-options.dto'

interface IPageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto
  itemCount: number
}

export class PageMetaDto {
  @Expose()
  @ApiProperty()
  readonly page: number

  @Expose()
  @ApiProperty()
  readonly take: number

  @Expose()
  @ApiProperty()
  readonly itemCount: number

  @Expose()
  @ApiProperty()
  readonly pageCount: number

  @Expose()
  @ApiProperty()
  readonly hasPreviousPage: boolean

  @Expose()
  @ApiProperty()
  readonly hasNextPage: boolean

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page
    this.take = pageOptionsDto.take

    this.itemCount = itemCount
    this.pageCount = Math.ceil(this.itemCount / this.take)
    this.hasPreviousPage = this.page > 1
    this.hasNextPage = this.page < this.pageCount
  }
}
