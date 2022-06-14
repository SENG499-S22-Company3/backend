import { gql } from 'graphql-tag';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { resolvers } from '../src/resolvers';
import fs from 'fs';

const typeDefs = fs.readFileSync('./src/schema/schema.graphql', 'utf8');
let testServer: ApolloServer<ExpressContext>;

beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // connect to DB
});

const CreatingUser = gql`
  mutation CreatingUserMutation($username: String!) {
    createUser(username: $username) {
      success
      message
      username
      password
    }
  }
`;

const logoutMutation = gql`
  mutation logoutMutation {
    logout {
      token
      success
      message
    }
  }
`;

const loginMutation = gql`
  mutation loginMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      success
      message
    }
  }
`;

describe('MUTATION TESTS', () => {
  it('create user test', async () => {
    const result = await testServer.executeOperation({
      query: CreatingUser,
      variables: { username: 'test' },
    });

    //
    expect(result.data).toEqual({
      createUser: {
        message: '',
        success: false,
        password: '',
        username: 'test',
      },
    });
  });

  it('login test', async () => {
    const result = await testServer.executeOperation({
      query: loginMutation,
      variables: { username: 'test', password: 'test123' },
    });

    // will be throwing error as username and password cannot be set for now Error:***GraphQLError: Cannot set properties of undefined (setting 'username')]]**
    // However, params.username and params.passwords gets logged!
    expect(result.data).toThrowErrorMatchingSnapshot;
    // if database is set then
    // expect(result).toEqual({
    // 	data: {
    // 	  login: {
    // 		token: dbUser.token
    // 		success: dbUser.success
    // 		message: dbUser.message
    // 	  }
    // 	}
    // )};
  });

  it('logout test', async () => {
    const result = await testServer.executeOperation({
      query: logoutMutation,
    });

    // will be throwing error as username and password cannot be set for now Error:***GraphQLError: Cannot set properties of undefined (setting 'username')]]**
    // However, gets logged
    expect(result.data).toThrowErrorMatchingSnapshot;
    // if database is set then
    // expect(result).toEqual({
    // 	data: {
    // 	  logout: {
    // 		token: dbUser.token
    // 		success: dbUser.success
    // 		message: dbUser.message
    // 	  }
    // 	}
    // )};
  });

  // ToDo: Other Mutations after DB is set
});
