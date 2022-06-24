export {
  expectAuthPayload,
  expectCreateUserInput,
  expectResetPassword,
  expectResponse,
  expectUser,
  expectSurvey,
  expectCourses,
  expectSchedule,
};

function expectCreateUserInput(result: any) {
  expect(typeof result.message).toBe('string');
  expect(typeof result.username).toBe('string');
  expect(typeof result.password).toBe('string');
  expect(typeof result.success).toBe('boolean');
  expect(result.data).toMatchSnapshot();
}

function expectAuthPayload(result: any) {
  expect(typeof result.message).toBe('string');
  expect(typeof result.token).toBe('string');
  expect(typeof result.success).toBe('boolean');
}

function expectResponse(result: any) {
  expect(typeof result.message).toBe('string');
  expect(typeof result.success).toBe('boolean');
}

function expectResetPassword(result: any) {
  expect(typeof result.message).toBe('string');
  expect(typeof result.password).toBe('string');
  expect(typeof result.success).toBe('boolean');
}

function expectUser(result: any) {
  expect(typeof result.id).toBe('number');
  expect(typeof result.username).toBe('string');
  expect(typeof result.password).toBe('string');
  expect(typeof result.role).toBe('string');
  expect(typeof result.preferences[0].id.subject).toBe('string');
  expect(typeof result.preferences[0].id.code).toBe('string');
  expect(typeof result.preferences[0].id.term).toBe('string');
  expect(typeof result.preferences[0].preference).toBe('number');
  expect(typeof result.active).toBe('boolean');
}

function expectSurvey(result: any) {
  expect(typeof result.subject).toBe('string');
  expect(typeof result.code).toBe('string');
  expect(typeof result.term).toBe('string');
}

function expectCourses(result: any) {
  expect(typeof result.CourseID.subject).toBe('string');
  expect(typeof result.CourseID.code).toBe('string');
  expect(typeof result.CourseID.term).toBe('string');
  expect(typeof result.hoursPerWeek).toBe('number');
  expect(typeof result.capacity).toBe('number');
  expect(typeof result.professors[0].id).toBe('number');
  expect(typeof result.professors[0].username).toBe('string');
  expect(typeof result.professors[0].password).toBe('string');
  expect(typeof result.professors[0].role).toBe('string');
  expect(typeof result.professors[0].preferences[0].id.subject).toBe('string');
  expect(typeof result.professors[0].preferences[0].id.code).toBe('string');
  expect(typeof result.professors[0].preferences[0].id.term).toBe('string');
  expect(typeof result.professors[0].preferences[0].preference).toBe('number');
  expect(typeof result.professors[0].active).toBe('boolean');
  expect(typeof result.startDate).toBe('string');
  expect(typeof result.endDate).toBe('string');
  expect(typeof result.meetingTimes[0].day).toBe('string');
  expect(typeof result.meetingTimes[0].endTime).toBe('string');
  expect(typeof result.meetingTimes[0].startTime).toBe('string');
}

function expectSchedule(result: any) {
  expect(typeof result.id).toBe('string');
  expect(typeof result.year).toBe('number');
  expect(typeof result.createdAt).toBe('string');
  expect(typeof result.courses[0].CourseID.subject).toBe('string');
  expect(typeof result.courses[0].CourseID.code).toBe('string');
  expect(typeof result.courses[0].CourseID.term).toBe('string');
  expect(typeof result.courses[0].hoursPerWeek).toBe('number');
  expect(typeof result.courses[0].capacity).toBe('number');
  expect(typeof result.courses[0].professors[0].id).toBe('number');
  expect(typeof result.courses[0].professors[0].username).toBe('string');
  expect(typeof result.courses[0].professors[0].password).toBe('string');
  expect(typeof result.courses[0].professors[0].role).toBe('string');
  expect(typeof result.courses[0].professors[0].preferences[0].id.subject).toBe(
    'string'
  );
  expect(typeof result.courses[0].professors[0].preferences[0].id.code).toBe(
    'string'
  );
  expect(typeof result.courses[0].professors[0].preferences[0].id.term).toBe(
    'string'
  );
  expect(typeof result.courses[0].professors[0].preferences[0].preference).toBe(
    'number'
  );
  expect(typeof result.courses[0].professors[0].active).toBe('boolean');
  expect(typeof result.courses[0].startDate).toBe('string');
  expect(typeof result.courses[0].endDate).toBe('string');
  expect(typeof result.courses[0].meetingTimes[0].day).toBe('string');
  expect(typeof result.courses[0].meetingTimes[0].endTime).toBe('string');
  expect(typeof result.courses[0].meetingTimes[0].startTime).toBe('string');
}
