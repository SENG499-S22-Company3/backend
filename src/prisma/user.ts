import { PrismaClient } from '@prisma/client';
export { prisma, findUserByUsername, findUserById };

const prisma = new PrismaClient();

async function findUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  return user;
}

async function findUserById(userid: number) {
  const finduser = await prisma.user.findUnique({
    where: { id: userid },
  });
  return finduser;
}
