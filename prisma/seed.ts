import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '../src/schema';

const prisma = new PrismaClient();

async function seedUsers(): Promise<void> {
  // create default development admin user
  await prisma.user.create({
    data: {
      username: 'testadmin',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.Admin,
    },
  });

  await prisma.user.create({
    data: {
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.User,
    },
  });
}

// A `main` function so that you can use async/await
async function main() {
  await seedUsers();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
