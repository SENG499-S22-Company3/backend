import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Role } from '../src/schema';

const prisma = new PrismaClient();

// A `main` function so that you can use async/await
async function main() {
  // create default development admin user
  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      active: true,
      hasPeng: false,
      role: Role.Admin,
    },
  });
  // use `console.dir` to print nested objects
  // console.dir(allUsers, { depth: null });
  console.log(user);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
