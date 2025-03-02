import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { CustomConflictException } from '@/exceptions'
import { User } from '@prisma/client'
import { omitTimeStampFields } from '@/utils'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email, username: createUserDto.username },
    })
    if (existingUser) {
      throw new CustomConflictException('username or email')
    }

    return this.prisma.user.create({
      data: createUserDto,
    })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({})
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      omit: {
        password: true,
      },
    })

    return omitTimeStampFields(user)
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
