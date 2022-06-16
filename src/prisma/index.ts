import { PrismaClient } from '@prisma/client';
export { prisma, lookupUser };

const prisma = new PrismaClient();

async function lookupUser(username: string) {
  console.log(`looking up ${username}`);
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  console.log(user);
  return user;
}
