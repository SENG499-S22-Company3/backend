import { prisma } from './index';
export { findUserByUsername, findUserById, findAllUsers };

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

async function findAllUsers() {
  const allusers = await prisma.user.findMany();
  return allusers;
}
