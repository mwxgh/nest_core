import 'dotenv/config'
import { PrismaClient, RoleType } from '../prisma_generated/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  connectionLimit: 5,
})
const prisma = new PrismaClient({ adapter })

const main = async () => {
  const roles = Object.values(RoleType)

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        description: `${role} role`,
      },
    })
  }
}

main()
  .catch((error) => {
    console.error('Role seeding failed', error)
    process.exit(1)
  })
  .finally(async () => prisma.$disconnect())
