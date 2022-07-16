import { gql } from 'graphql-tag';
export {
  CreatingUser,
  loginMutation,
  logoutMutation,
  ResettingPassword,
  CreatingTeachingPreferences,
  ChangingUserPassword,
  GeneratingSchedule,
  meQuery,
  finduseridquery,
  schedulequery,
  surveyQuery,
  coursesquery,
};

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

const ChangingUserPassword = gql`
  mutation ChangeUserPassword($input: ChangeUserPasswordInput!) {
    changeUserPassword(input: $input) {
      success
      message
    }
  }
`;

const ResettingPassword = gql`
  mutation ResetPassword($id: ID!) {
    resetPassword(id: $id) {
      success
      message
      password
    }
  }
`;

const CreatingTeachingPreferences = gql`
  mutation CreateTeachingPreferences($input: CreateTeachingPreferenceInput!) {
    createTeachingPreference(input: $input) {
      success
      message
    }
  }
`;

const GeneratingSchedule = gql`
  mutation GenerateSchedule($input: GenerateScheduleInput!) {
    generateSchedule(input: $input) {
      success
      message
    }
  }
`;

const meQuery = gql`
  query {
    me {
      id
      username
      password
      role
      preferences {
        id {
          subject
          code
          term
        }
        preference
      }
      active
    }
  }
`;

const surveyQuery = gql`
  query {
    survey {
      courses {
        subject
        code
        term
      }
    }
  }
`;

const finduseridquery = gql`
  query {
    findUserById(id: 1) {
      id
      username
      password
      role
      preferences {
        id {
          subject
          code
          term
        }
        preference
      }
      active
    }
  }
`;

const coursesquery = gql`
  query Courses($term: Term!) {
    courses(term: $term) {
      CourseID {
        subject
        code
        term
      }
      hoursPerWeek
      capacity
      professors {
        id
        username
        password
        role
        preferences {
          id {
            subject
            code
            term
          }
          preference
        }
        active
      }
      startDate
      endDate
      meetingTimes {
        day
        startTime
        endTime
      }
    }
  }
`;

const schedulequery = gql`
  query Schedule($year: Int, $term: Term!) {
    schedule(year: $year) {
      id
      year
      createdAt
      courses(term: $term) {
        CourseID {
          subject
          code
          term
        }
        hoursPerWeek
        capacity
        professors {
          id
          username
          password
          role
          preferences {
            id {
              subject
              code
              term
            }
            preference
          }
          active
        }
        startDate
        endDate
        meetingTimes {
          day
          startTime
          endTime
        }
      }
    }
  }
`;
