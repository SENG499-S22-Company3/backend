"use strict";

const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const EasyGraphQLTester = require("easygraphql-tester");

const schemaCode = fs.readFileSync(
	path.join(__dirname, "..", "src/schema", "schema.graphql"),
	"utf8"
);

describe("QUERY TEST SUITE", () => {
	let tester;
	beforeAll(() => {
		const resolvers = {
			Query: {
				me: (root, args, ctx) => {
					return null;
				},
			},
		};
		tester = new EasyGraphQLTester(schemaCode, resolvers);
	});

	// ************************ TEST QUERIES ***************************

	// INVALID QUERY FIELDS

	describe("INVALID QUERY TEST CASES", () => {
		test("Invalid Query fields for me", () => {
			const invalidQuery = `
        {
          me {
            email
            phone
            address
            gender
          }
        }
      `;

			tester.test(false, invalidQuery);
		});

		test("Invalid Query fields for findUserById", () => {
			const invalidQuery = `
        {
          findUserById() {
            email
            phone
            address
            gender
          }
        }
      `;

			tester.test(false, invalidQuery);
		});

		test("Invalid Query fields for survey", () => {
			const invalidQuery = `
        {
          survey {
            username
          }
        }
      `;

			tester.test(false, invalidQuery);
		});

		test("Invalid Query fields for courses", () => {
			const invalidQuery = `
        {
          courses {
            id
            username
            startTime
            endTime
          }
        }
      `;

			tester.test(false, invalidQuery);
		});

		test("Invalid Query fields for schedule", () => {
			const invalidQuery = `
        {
          schedule {
            day
            month
            year
          }
        }
      `;

			tester.test(false, invalidQuery);
		});
	});
	// VALID QUERIES
	describe("VALID QUERY TEST CASES", () => {
		test("Valid Query Fields for me", () => {
			const validQuery = `
        {
          me{
            id
            username
            password
            role
            preferences{
              id{
                subject,
                code,
                term
              },
              preference
            }
            active
          }
        }
      `;

			tester.test(true, validQuery);
		});

		test("Valid Query Fields for findUserById", () => {
			const validQuery = `
        {
          findUserById(id: 1){
            id
            username
            password
            role
            preferences{
              id{
                subject,
                code,
                term
              },
              preference
            }
            active
          }
        }
      `;

			tester.test(true, validQuery);
		});

		test("Valid Query Fields for survey", () => {
			const validQuery = `
        {
          survey{
           courses{
             subject,
             code,
             term
           }
          }
        }
      `;

			tester.test(true, validQuery);
		});

		test("Valid Query Fields for courses", () => {
			const validQuery = `
        {
          courses(term: FALL){
            CourseID{
             subject,
             code,
             term
           },
           hoursPerWeek,
           capacity,
           professors{
            id
            username
            password
            role
            preferences{
              id{
                subject,
                code,
                term
              },
              preference
            }
            active
           },
           startDate,
           endDate,
           meetingTimes{
             day,
             startTime,
             endTime
           }
          }
        }
      `;

			tester.test(true, validQuery);
		});

		test("Valid Query Fields for schedule", () => {
			//How not to hardcode the values like year and term???
			const validQuery = `
        {
          schedule(year: 2021){ 
            id,
            year,
            createdAt,
            courses(term: FALL){
              CourseID{
               subject,
               code,
               term
             },
             hoursPerWeek,
             capacity,
             professors{
              id
              username
              password
              role
              preferences{
                id{
                  subject,
                  code,
                  term
                },
                preference
              }
              active
             },
             startDate,
             endDate,
             meetingTimes{
               day,
               startTime,
               endTime
             }
            }
          }
        }
      `;

			tester.test(true, validQuery);
		});
	});
	describe("MOCK QUERY TEST CASES", () => {
		test("Mock Test for USER type", () => {
			const query = `
        {
            me{
                id
                username
                password
                role
                preferences{
                  id{
                    subject,
                    code,
                    term
                  },
                  preference
                }
                active
            }
        }
      `;

			const {
				data: { me },
			} = tester.mock(query);
			expect(me).to.exist;
			expect(me.id).to.exist;
			expect(me.username).to.be.a("string");
			expect(me.password).to.be.a("string");
			expect(["ADMIN", "USER"]).to.include(me.role);
			expect(me.preferences).to.be.a("array");
			expect(me.preferences[0].preference).to.be.a("number");
			expect(me.preferences[0].id.subject).to.be.a("string");
			expect(me.preferences[0].id.code).to.be.a("string");
			expect(["FALL", "SPRING", "SUMMER"]).to.include(
				me.preferences[0].id.term
			);
			expect(me.active).to.be.a("boolean");
		});

		test("Mock Test for TeachingPreferenceSurvey type", () => {
			const query = `
      {
        survey{
          courses{
            subject,
            code,
            term
          }
        }
      }
      `;

			const {
				data: { survey },
			} = tester.mock(query);
			expect(survey).to.exist;
			expect(survey.courses).to.be.a("array");
			expect(survey.courses[0].subject).to.be.a("string");
			expect(survey.courses[0].code).to.be.a("string");
			expect(["FALL", "SPRING", "SUMMER"]).to.include(survey.courses[0].term);
		});

		test("Mock Test for CourseSection type", () => {
			//How not to hardcode the values like year and term???
			const query = `
      {
        courses(term: FALL){
          CourseID{
           subject,
           code,
           term
         },
         hoursPerWeek,
         capacity,
         professors{
          id
          username
          password
          role
          preferences{
            id{
              subject,
              code,
              term
            },
            preference
          }
          active
         },
         startDate,
         endDate,
         meetingTimes{
           day,
           startTime,
           endTime
         }
        }
      }
    `;

			const {
				data: { courses },
			} = tester.mock(query);
			expect(courses).to.exist;
			expect(courses).to.be.a("array");
			expect(courses[0].CourseID.subject).to.be.a("string");
			expect(courses[0].CourseID.code).to.be.a("string");
			expect(["FALL", "SPRING", "SUMMER"]).to.include(courses[0].CourseID.term);
			expect(courses[0].hoursPerWeek).to.be.a("number");
			expect(courses[0].capacity).to.be.a("number");
			expect(courses[0].professors[0].id).to.exist;
			expect(courses[0].professors[0].username).to.be.a("string");
			expect(courses[0].professors[0].password).to.be.a("string");
			expect(["ADMIN", "USER"]).to.include(courses[0].professors[0].role);
			expect(courses[0].professors[0].preferences).to.be.a("array");
			expect(courses[0].professors[0].preferences[0].preference).to.be.a(
				"number"
			);
			expect(courses[0].professors[0].preferences[0].id.subject).to.be.a(
				"string"
			);
			expect(courses[0].professors[0].preferences[0].id.code).to.be.a("string");
			expect(["FALL", "SPRING", "SUMMER"]).to.include(
				courses[0].professors[0].preferences[0].id.term
			);
			expect(courses[0].professors[0].active).to.be.a("boolean");
			expect(courses[0].startDate).to.be.a("object");
			expect(courses[0].endDate).to.be.a("object");
			expect(courses[0].meetingTimes).to.be.a("array");
			expect(courses[0].meetingTimes[0].day).to.be.a("string");
			expect(courses[0].meetingTimes[0].startTime).to.be.a("object");
			expect(courses[0].meetingTimes[0].endTime).to.be.a("object");
		});

		test("Mock Test for Schedule type", () => {
			//How not to hardcode the values like year and term???
			const query = `
      {
        schedule(year: 2021){
          id,
          year,
          createdAt,
          courses(term: FALL){
            CourseID{
             subject,
             code,
             term
           },
           hoursPerWeek,
           capacity,
           professors{
            id
            username
            password
            role
            preferences{
              id{
                subject,
                code,
                term
              },
              preference
            }
            active
           },
           startDate,
           endDate,
           meetingTimes{
             day,
             startTime,
             endTime
           }
          }
        }
      }
    `;

			const {
				data: { schedule },
			} = tester.mock(query);
			expect(schedule.id).to.exist;
			expect(schedule.year).to.exist;
			expect(schedule.year).to.be.a("number");
			expect(schedule.createdAt).to.be.a("object");
			expect(schedule.courses[0].CourseID.subject).to.be.a("string");
			expect(schedule.courses[0].CourseID.code).to.be.a("string");
			expect(["FALL", "SPRING", "SUMMER"]).to.include(
				schedule.courses[0].CourseID.term
			);
			expect(schedule.courses[0].hoursPerWeek).to.be.a("number");
			expect(schedule.courses[0].capacity).to.be.a("number");
			expect(schedule.courses[0].professors[0].id).to.exist;
			expect(schedule.courses[0].professors[0].username).to.be.a("string");
			expect(schedule.courses[0].professors[0].password).to.be.a("string");
			expect(["ADMIN", "USER"]).to.include(
				schedule.courses[0].professors[0].role
			);
			expect(schedule.courses[0].professors[0].preferences).to.be.a("array");
			expect(
				schedule.courses[0].professors[0].preferences[0].preference
			).to.be.a("number");
			expect(
				schedule.courses[0].professors[0].preferences[0].id.subject
			).to.be.a("string");
			expect(schedule.courses[0].professors[0].preferences[0].id.code).to.be.a(
				"string"
			);
			expect(["FALL", "SPRING", "SUMMER"]).to.include(
				schedule.courses[0].professors[0].preferences[0].id.term
			);
			expect(schedule.courses[0].professors[0].active).to.be.a("boolean");
			expect(schedule.courses[0].startDate).to.be.a("object");
			expect(schedule.courses[0].endDate).to.be.a("object");
			expect(schedule.courses[0].meetingTimes).to.be.a("array");
			expect(schedule.courses[0].meetingTimes[0].day).to.be.a("string");
			expect(schedule.courses[0].meetingTimes[0].startTime).to.be.a("object");
			expect(schedule.courses[0].meetingTimes[0].endTime).to.be.a("object");
		});
	});
});
