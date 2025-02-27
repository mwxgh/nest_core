import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'

export class AbstractDto {
  @Expose()
  @ApiProperty({ type: 'number' })
  id: number

  createdAt: Date

  @Exclude({ toClassOnly: true })
  updatedAt: Date

  @Exclude()
  deletedAt?: Date
}

export class AbstractDtoWithCU extends AbstractDto {
  createdBy?: number

  updatedBy?: number
}
