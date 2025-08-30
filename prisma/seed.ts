import { PrismaClient } from '@prisma/client'
import { Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
  })

  const employeeUser = await prisma.user.upsert({
    where: { email: 'employee@demo.com' },
    update: {},
    create: {
      email: 'employee@demo.com',
      name: 'Employee User',
      role: Role.EMPLOYEE,
    },
  })

  // Create demo clients
  const client1 = await prisma.client.upsert({
    where: { id: 'client1' },
    update: {},
    create: {
      id: 'client1',
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      phone: '+1-555-0123',
      address: '123 Business St, Suite 100, New York, NY 10001',
    },
  })

  const client2 = await prisma.client.upsert({
    where: { id: 'client2' },
    update: {},
    create: {
      id: 'client2',
      name: 'Tech Solutions Inc',
      email: 'accounts@techsolutions.com',
      phone: '+1-555-0456',
      address: '456 Innovation Ave, San Francisco, CA 94105',
    },
  })

  console.log('Seed data created successfully!')
  console.log('Admin user:', adminUser)
  console.log('Employee user:', employeeUser)
  console.log('Clients:', [client1, client2])
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })