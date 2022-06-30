import { faker } from '@faker-js/faker';
import { Day, Role, Term } from '../src/schema';
export { mocks };

const mocks = {
  CreateUserMutationResult: () => ({
    message: () => faker.hacker.phrase(),
    username: () => faker.name.firstName(),
    password: () => faker.animal.cat(),
    success: () => true,
  }),

  AuthPayload: () => ({
    success: () => true,
    token: () => faker.internet.ipv4(),
    message: () => faker.company.catchPhraseDescriptor(),
  }),

  ResetPasswordMutationResult: () => ({
    success: () => true,
    message: () => faker.datatype.string(),
    password: () => faker.address.cityName(),
  }),

  Response: () => ({
    success: () => true,
    message: () => faker.animal.dog(),
  }),

  User: () => ({
    id: () => faker.datatype.number(),
    username: () => faker.name.firstName(),
    password: () => faker.finance.accountName(),
    role: () => Role.User,
    preferences: () => [
      {
        id: {
          subject: faker.company.companyName(),
          code: faker.internet.ip(),
          term: Term.Fall,
        },
        preference: faker.datatype.number(),
      },
    ],
    active: () => true,
  }),

  TeachingPreferenceSurvey: () => ({
    courses: () => [
      {
        subject: faker.company.companyName(),
        code: faker.internet.ip(),
        term: Term.Fall,
      },
    ],
  }),

  CourseSection: () => ({
    CourseID: {
      subject: faker.company.companyName(),
      code: faker.internet.ip(),
      term: Term.Fall,
    },
    hoursPerWeek: () => faker.datatype.number(),
    capacity: () => faker.datatype.number(),
    professors: () => [
      {
        id: faker.datatype.number(),
        username: faker.name.firstName(),
        password: faker.finance.accountName(),
        role: Role.User,
        preferences: [
          {
            id: {
              subject: faker.company.companyName(),
              code: faker.internet.ip(),
              term: Term.Fall,
            },
            preference: faker.datatype.number(),
          },
        ],
        active: true,
      },
    ],
    startDate: () => faker.datatype.string(),
    endDate: () => faker.datatype.string(),
    meetingTimes: () => [
      {
        day: Day.Friday,
        startTime: faker.datatype.string(),
        endTime: faker.datatype.string(),
      },
    ],
  }),

  Schedule: () => ({
    id: () => faker.address.country(),
    year: () => faker.random.numeric(),
    createdAt: () => faker.datatype.string(),
    courses: () => [
      {
        CourseID: {
          subject: faker.company.companyName(),
          code: faker.internet.ip(),
          term: Term.Fall,
        },
        hoursPerWeek: faker.datatype.number(),
        capacity: faker.datatype.number(),
        professors: [
          {
            id: faker.datatype.number(),
            username: faker.name.firstName(),
            password: faker.finance.accountName(),
            role: Role.User,
            preferences: [
              {
                id: {
                  subject: faker.company.companyName(),
                  code: faker.internet.ip(),
                  term: Term.Fall,
                },
                preference: faker.datatype.number(),
              },
            ],
            active: true,
          },
        ],
        startDate: faker.datatype.string(),
        endDate: faker.datatype.string(),
        meetingTimes: [
          {
            day: Day.Friday,
            startTime: faker.datatype.string(),
            endTime: faker.datatype.string(),
          },
        ],
      },
    ],
  }),
};
