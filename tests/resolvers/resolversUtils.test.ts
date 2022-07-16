import { generateScheduleWithCapacities } from '../../src/resolvers/resolverUtils';
import { Context } from '../../src/context';
import {
  request,
  company3AxiosEndpoints,
  company4AxiosEndpoints,
} from '../../src/algorithm';
import {
  Company,
  CourseInput,
  GenerateScheduleInput,
  Term,
  User,
  Role,
} from '../../src/schema';
import {
  CourseObject,
  CourseObjectSemesterEnum,
} from '../../src/client/algorithm2';

describe('Test resolver utility functionality', () => {
  describe('Test generate schedule with capacities provided', () => {
    let context: Context;

    beforeAll(() => {
      // Setup context to be input. Do not require user as it is
      // not used.
      context = {
        algorithm: request,
      };
    });

    beforeEach(() => {
      // Set Axios endpoints as mocks to validate input being called properly,
      // and to avoid trying to connect to algorithm 1 endpoint.
      company3AxiosEndpoints.algo1 = jest.fn();
      company4AxiosEndpoints.algo2 = jest.fn();
    });

    it('should send valid input to algorithm 1 endpoint with courses to schedule in all semesters, no capacities provided, professor with preferences', async () => {
      // Given (create all input objects)
      const input: GenerateScheduleInput = {
        algorithm1: Company.Company3,
        algorithm2: Company.Company3,
        courses: null,
        term: Term.Summer,
        year: 2022,
      };

      const fallTermCourses: CourseInput[] = [
        {
          code: '320',
          section: 1,
          subject: 'CSC',
        },
        {
          code: '355',
          section: 1,
          subject: 'CSC',
        },
      ];

      const springTermCourses: CourseInput[] = [
        {
          code: '349A',
          section: 2,
          subject: 'CSC',
        },
        {
          code: '250',
          section: 1,
          subject: 'ECE',
        },
      ];

      const summerTermCourses: CourseInput[] = [
        {
          code: '111',
          section: 3,
          subject: 'CSC',
        },
        {
          code: '275',
          section: 1,
          subject: 'SENG',
        },
      ];

      const users: User[] = [
        {
          active: true,
          displayName: 'Bird, Bill',
          hasPeng: false,
          id: 12,
          password: 'testpass',
          preferences: [
            {
              id: {
                code: '111',
                subject: 'CSC',
                term: Term.Summer,
                title:
                  'Fundamentals of Programming with Engineering Applications',
              },
              preference: 1,
            },
          ],
          role: Role.User,
          username: 'bbird',
        },
      ];

      const capacities: CourseObject[] = [];

      // When (call generateScheduleWithCapacities())
      generateScheduleWithCapacities(
        context,
        input,
        fallTermCourses,
        summerTermCourses,
        springTermCourses,
        users,
        capacities
      );

      // Then (validate algorithm1 Axios endpoint called with expected format)
      // Expect endpoint to be called as follows:
      const expectedAlgorithm1Input = {
        coursesToSchedule: {
          fallCourses: [
            {
              courseCapacity: 0,
              courseNumber: '320',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '355',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
          ],
          springCourses: [
            {
              courseCapacity: 0,
              courseNumber: '349A',
              courseTitle: 'testing',
              numSections: 2,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '250',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'ECE',
            },
          ],
          summerCourses: [
            {
              courseCapacity: 0,
              courseNumber: '111',
              courseTitle: 'testing',
              numSections: 3,
              sequenceNumber: 'A01',
              streamSequence: '1A',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '275',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '2B',
              subject: 'SENG',
            },
          ],
        },
        hardScheduled: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        professors: [
          {
            displayName: 'Bird, Bill',
            fallTermCourses: 1,
            preferences: [
              {
                courseNum: 'CSC111',
                preferenceNum: 1,
                term: 'SUMMER',
              },
            ],
            springTermCourses: 1,
            summerTermCourses: 1,
          },
        ],
      };

      expect(company3AxiosEndpoints.algo1).toHaveBeenCalledWith(
        expectedAlgorithm1Input
      );
    });

    it('should send valid input to algorithm 1 endpoint with courses to schedule in all semesters, no capacities provided, professor without preferences', async () => {
      // Given (create all input objects)
      const input: GenerateScheduleInput = {
        algorithm1: Company.Company3,
        algorithm2: Company.Company3,
        courses: null,
        term: Term.Summer,
        year: 2022,
      };

      const fallTermCourses: CourseInput[] = [
        {
          code: '320',
          section: 1,
          subject: 'CSC',
        },
        {
          code: '355',
          section: 1,
          subject: 'CSC',
        },
      ];

      const springTermCourses: CourseInput[] = [
        {
          code: '349A',
          section: 2,
          subject: 'CSC',
        },
        {
          code: '250',
          section: 1,
          subject: 'ECE',
        },
      ];

      const summerTermCourses: CourseInput[] = [
        {
          code: '111',
          section: 3,
          subject: 'CSC',
        },
        {
          code: '275',
          section: 1,
          subject: 'SENG',
        },
      ];

      const users: User[] = [
        {
          active: true,
          displayName: 'Bird, Bill',
          hasPeng: false,
          id: 12,
          password: 'testpass',
          preferences: [],
          role: Role.User,
          username: 'bbird',
        },
      ];

      const capacities: CourseObject[] = [];

      // When (call generateScheduleWithCapacities())
      generateScheduleWithCapacities(
        context,
        input,
        fallTermCourses,
        summerTermCourses,
        springTermCourses,
        users,
        capacities
      );

      // Then (validate algorithm1 Axios endpoint called with expected format)
      // Expect endpoint to be called as follows:
      const expectedAlgorithm1Input = {
        coursesToSchedule: {
          fallCourses: [
            {
              courseCapacity: 0,
              courseNumber: '320',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '355',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
          ],
          springCourses: [
            {
              courseCapacity: 0,
              courseNumber: '349A',
              courseTitle: 'testing',
              numSections: 2,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '250',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'ECE',
            },
          ],
          summerCourses: [
            {
              courseCapacity: 0,
              courseNumber: '111',
              courseTitle: 'testing',
              numSections: 3,
              sequenceNumber: 'A01',
              streamSequence: '1A',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '275',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '2B',
              subject: 'SENG',
            },
          ],
        },
        hardScheduled: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        professors: [],
      };

      expect(company3AxiosEndpoints.algo1).toHaveBeenCalledWith(
        expectedAlgorithm1Input
      );
    });

    it('should send valid input to algorithm 1 endpoint with no courses to schedule in any semester, no capacities provided, no professors', async () => {
      // Given (create all input objects)
      const input: GenerateScheduleInput = {
        algorithm1: Company.Company3,
        algorithm2: Company.Company3,
        courses: null,
        term: Term.Summer,
        year: 2022,
      };

      const fallTermCourses: CourseInput[] = [];
      const springTermCourses: CourseInput[] = [];
      const summerTermCourses: CourseInput[] = [];
      const users: User[] = [];
      const capacities: CourseObject[] = [];

      // When (call generateScheduleWithCapacities())
      generateScheduleWithCapacities(
        context,
        input,
        fallTermCourses,
        summerTermCourses,
        springTermCourses,
        users,
        capacities
      );

      // Then (validate algorithm1 Axios endpoint called with expected format)
      // Expect endpoint to be called as follows:
      const expectedAlgorithm1Input = {
        coursesToSchedule: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        hardScheduled: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        professors: [],
      };

      expect(company3AxiosEndpoints.algo1).toHaveBeenCalledWith(
        expectedAlgorithm1Input
      );
    });

    it('should send valid input to algorithm 1 endpoint with courses to schedule in all semesters, capacities provided, professor with preferences', async () => {
      // Given (create all input objects)
      const input: GenerateScheduleInput = {
        algorithm1: Company.Company3,
        algorithm2: Company.Company3,
        courses: null,
        term: Term.Summer,
        year: 2022,
      };

      const fallTermCourses: CourseInput[] = [
        {
          code: '320',
          section: 1,
          subject: 'CSC',
        },
        {
          code: '355',
          section: 1,
          subject: 'CSC',
        },
        {
          code: '111',
          section: 1,
          subject: 'CSC',
        },
      ];

      const springTermCourses: CourseInput[] = [
        {
          code: '349A',
          section: 2,
          subject: 'CSC',
        },
        {
          code: '250',
          section: 1,
          subject: 'ECE',
        },
        {
          code: '111',
          section: 1,
          subject: 'CSC',
        },
      ];

      const summerTermCourses: CourseInput[] = [
        {
          code: '111',
          section: 3,
          subject: 'CSC',
        },
        {
          code: '275',
          section: 1,
          subject: 'SENG',
        },
      ];

      const users: User[] = [
        {
          active: true,
          displayName: 'Bird, Bill',
          hasPeng: false,
          id: 12,
          password: 'testpass',
          preferences: [
            {
              id: {
                code: '111',
                subject: 'CSC',
                term: Term.Summer,
                title:
                  'Fundamentals of Programming with Engineering Applications',
              },
              preference: 1,
            },
          ],
          role: Role.User,
          username: 'bbird',
        },
      ];

      const capacities: CourseObject[] = [
        {
          subject: 'CSC',
          code: '111',
          seng_ratio: 0.5,
          semester: CourseObjectSemesterEnum.Fall,
          capacity: 72,
        },
        {
          subject: 'CSC',
          code: '111',
          seng_ratio: 0.5,
          semester: CourseObjectSemesterEnum.Spring,
          capacity: 112,
        },
        {
          subject: 'CSC',
          code: '111',
          seng_ratio: 0.5,
          semester: CourseObjectSemesterEnum.Summer,
          capacity: 50,
        },
      ];

      // When (call generateScheduleWithCapacities())
      generateScheduleWithCapacities(
        context,
        input,
        fallTermCourses,
        summerTermCourses,
        springTermCourses,
        users,
        capacities
      );

      // Then (validate algorithm1 Axios endpoint called with expected format)
      // Expect endpoint to be called as follows:
      const expectedAlgorithm1Input = {
        coursesToSchedule: {
          fallCourses: [
            {
              courseCapacity: 0,
              courseNumber: '320',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '355',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '3B',
              subject: 'CSC',
            },
            {
              courseCapacity: 72,
              courseNumber: '111',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '1A',
              subject: 'CSC',
            },
          ],
          springCourses: [
            {
              courseCapacity: 0,
              courseNumber: '349A',
              courseTitle: 'testing',
              numSections: 2,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '250',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '4B',
              subject: 'ECE',
            },
            {
              courseCapacity: 112,
              courseNumber: '111',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '1A',
              subject: 'CSC',
            },
          ],
          summerCourses: [
            {
              courseCapacity: 50,
              courseNumber: '111',
              courseTitle: 'testing',
              numSections: 3,
              sequenceNumber: 'A01',
              streamSequence: '1A',
              subject: 'CSC',
            },
            {
              courseCapacity: 0,
              courseNumber: '275',
              courseTitle: 'testing',
              numSections: 1,
              sequenceNumber: 'A01',
              streamSequence: '2B',
              subject: 'SENG',
            },
          ],
        },
        hardScheduled: {
          fallCourses: [],
          springCourses: [],
          summerCourses: [],
        },
        professors: [
          {
            displayName: 'Bird, Bill',
            fallTermCourses: 1,
            preferences: [
              {
                courseNum: 'CSC111',
                preferenceNum: 1,
                term: 'SUMMER',
              },
            ],
            springTermCourses: 1,
            summerTermCourses: 1,
          },
        ],
      };

      expect(company3AxiosEndpoints.algo1).toHaveBeenCalledWith(
        expectedAlgorithm1Input
      );
    });
  });
});
