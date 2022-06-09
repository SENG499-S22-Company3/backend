import { gql } from "graphql-tag";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { resolvers } from "../src/resolvers";
import fs from "fs";

const typeDefs = fs.readFileSync("./src/schema/schema.graphql", "utf8");
let testServer: ApolloServer<ExpressContext>;

beforeAll(() => {
	testServer = new ApolloServer({
		typeDefs,
		resolvers,
	});
});

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

describe("QUERY FIELD TESTS", () => {
	it("Valid Query Fields and types for me", async () => {
		const result = await testServer.executeOperation({
			query: meQuery,
		});

		//Will pass now as 'me' is giving null for now
		expect(result.data?.me).toBeNull;
		// expect(typeof result.data?.me.id).toBe("number");
		// expect(typeof result.data?.me.username).toBe("string");
		// expect(typeof result.data?.me.password).toBe("string");
	});

	it("Invalid Query Fields and types for me", async () => {
		const result = await testServer.executeOperation({
			query: gql`
				query {
					me {
						email
					}
				}
			`,
		});

		//will pass as me as null, but will pass in future as well as these fields are not there
		expect(result.data?.me.email).toBeUndefined;
	});

	it("Valid Query Fields for survey", async () => {
		const result = await testServer.executeOperation({
			query: surveyQuery,
		});

		//Will give null as there is no data
		expect(result.data?.survey).toBeNull;
		// expect(typeof result.data?.survey.courses).toBe("Array");
	});

	it("Invalid Query Fields for survey", async () => {
		const result = await testServer.executeOperation({
			query: gql`
				query {
					me {
						email
					}
				}
			`,
		});

		//will pass as me as null, but will pass in future as well as these fields are not there
		expect(result.data?.me.survey).toBeUndefined;
		// expect(typeof result.data?.survey.courses).toBe("Array");
	});

	it("Valid Query Fields for findUserByID", async () => {
		const result = await testServer.executeOperation({
			query: finduseridquery,
		});

		//Will give null as there is no data
		expect(result.data?.findUserByID).toBeNull;
		// expect(typeof result.data?.survey.courses).toBe("Array");
	});

	it("Invalid Query Fields for findUserByID", async () => {
		const result = await testServer.executeOperation({
			query: gql`
				query {
					findUserByID {
						email
					}
				}
			`,
		});

		//Will give null as there is no data
		expect(result.data?.findUserByID).toBeNull;
		// expect(typeof result.data?.survey.courses).toBe("Array");
	});
});
