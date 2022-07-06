import { User, Role } from '@prisma/client';
import { getISOTime, getMeetingDays } from './time';
import { addCourseSections } from './seedingFunctions';
import { getSeqNumber } from './courseSequenceNumber';
const isAdmin = (user: User) => user.role === Role.ADMIN;

export { getISOTime, isAdmin, getMeetingDays, addCourseSections, getSeqNumber };
