import { User, Role } from '@prisma/client';
import { getISOTime, getMeetingDays } from './time';
import { addCourseSections } from './seedingFunctions';
const isAdmin = (user: User) => user.role === Role.ADMIN;

export { getISOTime, isAdmin, getMeetingDays, addCourseSections };
