import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { mocks } from './mockDataSource';
import { Term } from '../src/schema';
import fs from 'fs';
import {
  expectUser,
  expectSurvey,
  expectCourses,
  expectSchedule,
} from './mockExpect';
import {
  meQuery,
  finduseridquery,
  surveyQuery,
  coursesquery,
  schedulequery,
} from './typeDefs';

const typeDefs = fs.readFileSync('./src/schema/schema.graphql', 'utf8');
let testServer: ApolloServer<ExpressContext>;

beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    mocks,
  });
});

describe('QUERY MOCK TESTS', () => {
  it('Mocking me', async () => {
    const result = await testServer.executeOperation({
      query: meQuery,
    });

    expectUser(result.data?.me);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mocking survey', async () => {
    const result = await testServer.executeOperation({
      query: surveyQuery,
    });

    expectSurvey(result.data?.survey.courses[0]);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mocking findUserByID', async () => {
    const result = await testServer.executeOperation({
      query: finduseridquery,
    });

    expectUser(result.data?.findUserById);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mocking Courses', async () => {
    const result = await testServer.executeOperation({
      query: coursesquery,
      variables: { term: Term.Fall },
    });

    expectCourses(result.data?.courses[0]);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });

  it('Mocking Schedule', async () => {
    const result = await testServer.executeOperation({
      query: schedulequery,
      variables: { year: 2021, term: Term.Fall },
    });

    expectSchedule(result.data?.schedule);
    try {
      expect(result.data).toMatchSnapshot();
    } catch (e) {
      console.log('error: ', e);
    }
  });
});
