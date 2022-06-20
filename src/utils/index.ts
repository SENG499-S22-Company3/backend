import { User, Role } from '@prisma/client';

export const isAdmin = (user: User) => user.role === Role.ADMIN;
