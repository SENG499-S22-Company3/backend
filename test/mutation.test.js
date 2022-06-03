"use strict";

const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const EasyGraphQLTester = require("easygraphql-tester");

const schemaCode = fs.readFileSync(
	path.join(__dirname, "..", "src/schema", "schema.graphql"),
	"utf8"
);

// ************************ TEST MUTATIONS ***************************

describe("MUTATION TEST SUITE", () => {
	let tester;
	beforeAll(() => {
		const resolver = {
			Mutation: {
				login: (__, args, ctx) => {
					const { username, password } = args.input;

					return {
						token,
						success,
						message,
					};
				},
			},
		};
		tester = new EasyGraphQLTester(schemaCode, resolver);
	});
	describe("INVALID MUTATION TEST CASES", () => {
		//Inavlid Input Test Cases

		test("Invalid Input for Login", () => {
			const LOGIN_MUTATION = `
            mutation LOGIN_MUTATION($username: String!, $password: String!) {
            login(username: $username, password: $password) {
                success,
                token,
                message
            }
            }
        `;

			tester.test(false, LOGIN_MUTATION, {
				username: "JohnDoe",
				password: null,
			});
		});

		test("Invalid Input for CreateUser", () => {
			const CREATEUSER_MUTATION = `
            mutation CREATEUSER_MUTATION($username: String!) {
            createUser(username: $username) {
                success,
                message,
                username,
                password
            }
            }
        `;

			tester.test(false, CREATEUSER_MUTATION, {
				username: null,
			});
		});

		test("Invalid Input for UpdateUser", () => {
			const mutation = `
            mutation updateUser($input: UpdateUserInput!) {
            updateUser(input: $input) {
                user{
                id
                }
            }
            }
        `;
			// First arg: true because the input value is valid

			tester.test(false, mutation, {
				input: {
					id: null,
				},
			});
		});

		test("Invalid Input for ChangeUserPassword", () => {
			const CHANGEUSERPASSWORD_MUTATION = `
            mutation CHANGEUSERPASSWORD_MUTATION($input: ChangeUserPasswordInput!) {
            changeUserPassword(input: $input) {
                success,
                message,
            }
            }
        `;

			tester.test(false, CHANGEUSERPASSWORD_MUTATION, {
				input: {
					currentPassword: null,
					newPassword: "JohnDoe123",
				},
			});
		});

		test("Invalid Input for ResetPassword", () => {
			const RESETPASSWORD_MUTATION = `
            mutation RESETPASSWORD_MUTATION($id: ID!) {
            resetPassword(id: $id) {
                success,
                message,
                password
            }
            }
        `;

			tester.test(false, RESETPASSWORD_MUTATION, {
				id: [1234],
			});
		});

		test("Invalid Input for CreateTeachingPreference", () => {
			const CREATETEACHINGPREFERENCE_MUTATION = `
                mutation CREATETEACHINGPREFERENCE_MUTATION($input: CreateTeachingPreferenceInput!) {
                    createTeachingPreference(input: $input) {
                        success,
                        message
                    }
                }
            `;

			tester.test(false, CREATETEACHINGPREFERENCE_MUTATION, {
				input: {
					peng: "no",
					userId: 12,
					courses: [], //not sure how to implement this here
				},
			});
		});

		test("Invalid Input for GenerateSchedule", () => {
			const GENERATESCHEDULE_MUTATION = `
            mutation GENERATESCHEDULE_MUTATION($input: GenerateScheduleInput!) {
                generateSchedule(input: $input) {
                    success,
                    message
                }
            }`;

			tester.test(false, GENERATESCHEDULE_MUTATION, {
				input: {
					year: "2021",
				},
			});
		});
	});

	describe("MOCK MUTATION TEST CASES", () => {
		test("Mock Test Login", () => {
			const LOGIN_MUTATION = `
        mutation LOGIN_MUTATION($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            success,
            token,
            message
          }
        }
      `;

			const {
				data: { login },
			} = tester.mock(LOGIN_MUTATION, {
				username: "JohnDoe",
				password: "johnDoe123",
			});

			expect(login).to.exist;
			expect(login.success).to.be.a("boolean");
			expect(login.token).to.be.a("string");
		});

		test("Mock Test CreateUser", () => {
			const CREATEUSER_MUTATION = `
        mutation CREATEUSER_MUTATION($username: String!) {
          createUser(username: $username) {
            success,
            message,
            username,
            password
          }
        }
      `;

			const {
				data: { createUser },
			} = tester.mock(CREATEUSER_MUTATION, {
				username: "JohnDoe",
			});

			expect(createUser).to.exist;
			expect(createUser.success).to.be.a("boolean");
		});

		test("Mock Test UpdateUser", () => {
			const mutation = `
        mutation updateUser($input: UpdateUserInput!) {
          updateUser(input: $input) {
            user{
              id
            }
          }
        }
      `;
			// First arg: true because the input value is valid

			const {
				data: { updateUser },
			} = tester.mock(mutation, {
				input: {
					id: 1,
				},
			});
			expect(updateUser).to.exist;
			expect(updateUser.user.id).to.be.a("number");
		});

		test("Mock Test ChangeUserPassword", () => {
			const CHANGEUSERPASSWORD_MUTATION = `
        mutation CHANGEUSERPASSWORD_MUTATION($input: ChangeUserPasswordInput!) {
          changeUserPassword(input: $input) {
            success,
            message,
          }
        }
      `;

			const {
				data: { changeUserPassword },
			} = tester.mock(CHANGEUSERPASSWORD_MUTATION, {
				input: {
					currentPassword: "JohnDoe2010",
					newPassword: "JohnDoe123",
				},
			});
			expect(changeUserPassword).to.exist;
			expect(changeUserPassword.success).to.be.a("boolean");
		});

		test("Mock Test ResetPassword", () => {
			const RESETPASSWORD_MUTATION = `
        mutation RESETPASSWORD_MUTATION($id: ID!) {
          resetPassword(id: $id) {
            success,
            message,
            password
          }
        }
      `;

			const {
				data: { resetPassword },
			} = tester.mock(RESETPASSWORD_MUTATION, {
				id: 5,
			});

			expect(resetPassword).to.exist;
			expect(resetPassword.success).to.be.a("boolean");
		});

		test("Mock Test CreateTeachingPreference", () => {
			const CREATETEACHINGPREFERENCE_MUTATION = `
        mutation CREATETEACHINGPREFERENCE_MUTATION($input: CreateTeachingPreferenceInput!) {
          createTeachingPreference(input: $input) {
            success,
            message
          }
        }
      `;

			const {
				data: { createTeachingPreference },
			} = tester.mock(CREATETEACHINGPREFERENCE_MUTATION, {
				input: {
					peng: true,
					userId: 12,
					courses: [], //not sure how to implement this here
				},
			});
			expect(createTeachingPreference).to.exist;
			expect(createTeachingPreference.success).to.be.a("boolean");
		});

		test("Mock Test GenerateSchedule", () => {
			const GENERATESCHEDULE_MUTATION = `
        mutation GENERATESCHEDULE_MUTATION($input: GenerateScheduleInput!) {
          generateSchedule(input: $input) {
            success,
            message
          }
        }
      `;

			const {
				data: { generateSchedule },
			} = tester.mock(GENERATESCHEDULE_MUTATION, {
				input: {
					year: 2021,
				},
			});

			expect(generateSchedule).to.exist;
			expect(generateSchedule.success).to.be.a("boolean");
		});
	});
});
