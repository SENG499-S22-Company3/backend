import fs from 'fs';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { mocks } from './mockDatasource';
import {
  CreatingUser,
  ChangingUserPassword,
  CreatingTeachingPreferences,
  GeneratingSchedule,
  loginMutation,
  logoutMutation,
  ResettingPassword,
} from './typedefs';
import {
  expectAuthPayload,
  expectCreateUserInput,
  expectResetPassword,
  expectResponse,
} from './mockexpect';

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
    expect(result.data).toMatchSnapshot;
  });

  it('Mock login', async () => {
    const result = await testServer.executeOperation({
      query: loginMutation,
      variables: { username: 'test', password: 'test123' },
    });

    expectAuthPayload(result.data?.login);
    expect(result.data).toMatchSnapshot;
  });

  it('Mock logout', async () => {
    const result = await testServer.executeOperation({
      query: logoutMutation,
    });

    expectAuthPayload(result.data?.logout);
    expect(result.data).toMatchSnapshot();
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
    expect(result.data).toMatchSnapshot();
  });

  it('Mock resetPassword', async () => {
    const result = await testServer.executeOperation({
      query: ResettingPassword,
      variables: { id: 1 },
    });

    expectResetPassword(result.data?.resetPassword);
    expect(result.data).toMatchSnapshot;
  });

  it('Mock createTeachingPreferences', async () => {
    const result = await testServer.executeOperation({
      query: CreatingTeachingPreferences,
      variables: {
        input: {
          peng: true,
          userId: 1,
          courses: [],
        },
      },
    });

    expectResponse(result.data?.createTeachingPreference);
    expect(result.data).toMatchSnapshot;
  });

  it('Mock generateSchedule', async () => {
    const result = await testServer.executeOperation({
      query: GeneratingSchedule,
      variables: {
        input: {
          year: 2021,
        },
      },
    });

    expectResponse(result.data?.generateSchedule);
    expect(result.data).toMatchSnapshot;
  });
});
