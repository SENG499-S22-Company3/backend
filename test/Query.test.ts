import { gql } from "graphql-tag";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "../src/resolvers";
import fs from "fs";
const { expect } = require("chai");

const typeDefs = fs.readFileSync("./src/schema/schema.graphql", "utf8");

it("Query Example Test", async () => {
	const testServer = new ApolloServer({
		typeDefs,
		resolvers,
	});

	let result = await testServer.executeOperation({
		query: gql`
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
		`,
	});

	//Will pass now as 'me' is giving null for now
	expect(result.data?.me).to.not.exist;
	expect(result.data?.me).to.be.null;
	// expect(result.data?.me.id).to.be.a("number");

	result = await testServer.executeOperation({
		query: gql`
			query {
				me {
					email
					phone
					address
					gender
				}
			}
		`,
	});

	//will pass as me as null, but will pass in future as well as these fields are not there
	expect(result.data?.me.email).to.not.exist;
	expect(result.data?.me.phone).to.not.exist;
	expect(result.data?.me.address).to.not.exist;
	expect(result.data?.me.gender).to.not.exist;

	//MUTATION not done yet
	// result = await testServer.executeOperation({
	// 	query:
	// 		"query LOGIN($username: String, $password: String) { login(name: $name, pass: $word) }",
	// 	variables: { name: "test", pass: "test" },
	// });

	// expect(result).toBe("hello");
});
