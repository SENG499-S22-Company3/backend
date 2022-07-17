import fs from 'fs';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { mocks } from './mockDataSource';
import {
  CreatingUser,
  ChangingUserPassword,
  CreatingTeachingPreferences,
  GeneratingSchedule,
  loginMutation,
  logoutMutation,
  ResettingPassword,
} from './typeDefs';
import {
  expectAuthPayload,
  expectCreateUserInput,
  expectResetPassword,
  expectResponse,
} from './mockExpect';
import { Company, Term } from '../../src/schema';

const typeDefs = fs.readFileSync('./src/schema/schema.graphql', 'utf8');
let testServer: ApolloServer<ExpressContext>;

beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    mocks,
  });
});

describe('MUTATION MOCK TESTS', () => {
  it('Mock createUser', async () => {
    const result = await testServer.executeOperation({
      query: CreatingUser,
      variables: { username: 'test' },
    });

    expectCreateUserInput(result.data?.createUser);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock login', async () => {
    const result = await testServer.executeOperation({
      query: loginMutation,
      variables: { username: 'test', password: 'test123' },
    });

    expectAuthPayload(result.data?.login);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock logout', async () => {
    const result = await testServer.executeOperation({
      query: logoutMutation,
    });

    expectAuthPayload(result.data?.logout);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock changePassword', async () => {
    const result = await testServer.executeOperation({
      query: ChangingUserPassword,
      variables: {
        input: {
          currentPassword: 'test',
          newPassword: 'mocking',
        },
      },
    });

    expectResponse(result.data?.changeUserPassword);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock resetPassword', async () => {
    const result = await testServer.executeOperation({
      query: ResettingPassword,
      variables: { id: 1 },
    });

    expectResetPassword(result.data?.resetPassword);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock createTeachingPreferences', async () => {
    const result = await testServer.executeOperation({
      query: CreatingTeachingPreferences,
      variables: {
        input: {
          peng: true,
          userId: 1,
          courses: [],
          nonTeachingTerm: Term.Fall,
          hasRelief: true,
          reliefReason: 'Need Break',
          hasTopic: true,
          topicDescription: 'Hello World',
        },
      },
    });

    expectResponse(result.data?.createTeachingPreference);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mock generateSchedule', async () => {
    const result = await testServer.executeOperation({
      query: GeneratingSchedule,
      variables: {
        input: {
          year: 2021,
          term: Term.Fall,
          courses: [],
          algorithm1: Company.Company3,
          algorithm2: Company.Company4,
        },
      },
    });

    expectResponse(result.data?.generateSchedule);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });
});
