import 'dotenv/config'
import {
  ActionManageType,
  PrismaClient,
  ResourceManageType,
  RoleType,
} from '../prisma_generated/client'
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
  const resources = Object.values(ResourceManageType)
  const actions = Object.values(ActionManageType)
  const roleDescriptions: Record<RoleType, string> = {
    [RoleType.ADMIN]:
      'Admin: full control to manage settings, users, and content',
    [RoleType.EDITOR]:
      'Editor: curates and approves content, keeping quality high',
    [RoleType.AUTHOR]:
      'Author: creates original content and keeps it up to date',
    [RoleType.CONTRIBUTOR]: 'Contributor: submits drafts and ideas for review',
    [RoleType.SUBSCRIBER]:
      'Subscriber: reads content and engages with the community',
  }

  await prisma.role.createMany({
    data: roles.map((name) => {
      const description = roleDescriptions[name]
      return { name, description }
    }),
    skipDuplicates: true,
  })

  const permissionData = resources.flatMap((resource) =>
    actions
      .filter((action) => {
        const isAllAll =
          resource === ResourceManageType.ALL && action === ActionManageType.ALL
        const isValidSpecific = resource !== ResourceManageType.ALL

        return isAllAll || isValidSpecific
      })
      .map((action) => ({ resource, action })),
  )

  await prisma.permission.createMany({
    data: permissionData,
    skipDuplicates: true,
  })
}

main()
  .catch((error) => {
    console.error('Role seeding failed', error)
    process.exit(1)
  })
  .finally(async () => prisma.$disconnect())
