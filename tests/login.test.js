import setup from "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";
import { createUser } from "./factories/userFactory.js";

const agent = supertest(app);

describe("POST /login", () => {
	beforeAll(async () => {
		await connection.query("DELETE FROM sessions;");
		await connection.query("DELETE FROM users;");
	});

	afterAll(() => {
		connection.end();
	});

	afterEach(async () => {
		await connection.query("DELETE FROM sessions;");
		await connection.query("DELETE FROM users;");
	});

	function generateLoginBody(user) {
		return {
			email: user?.email || "wrong_email@email.com",
			password: user?.password || "wrongPassword",
		};
	}

	it("returns 200 for valid params", async () => {
		await createUser({ cpf: "12345678912" });
		const body = generateLoginBody({ email: "test@email.com", password: "123456" });
		const result = await agent.post("/login").send(body);
		const status = result.status;
		expect(status).toEqual(200);
	});

	it("returns 401 for wrong (or nonexistent) email", async () => {
		await createUser({ cpf: "13245678912" });
		const body = generateLoginBody({ email: "wrong_email@email.com", password: "123456" });
		const result = await agent.post("/login").send(body);
		const status = result.status;
		expect(status).toEqual(401);
	});

	it("returns 401 for wrong password", async () => {
		await createUser();
		const body = generateLoginBody({ email: "test@email.com", password: "wrong_pass" });
		const result = await agent.post("/login").send(body);
		const status = result.status;
		expect(status).toEqual(401);
	});
});
