import setup from "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";

const agent = supertest(app);

describe("POST /signup", () => {
	beforeAll(async () => {
		await connection.query("DELETE FROM users;");
		await connection.query("DELETE FROM sessions;");
	});

	afterAll(() => {
		connection.end();
	});

	afterEach(async () => {
		await connection.query("DELETE FROM users;");
		await connection.query("DELETE FROM sessions;");
	});

	function generateSignUpBody(user) {
		return {
			name: user?.name || "fernando da silva teste",
			email: user?.email || "fernando@email.com",
			address: user?.address || "rua do teste 35",
			cpf: user?.cpf || "11111111111",
			password: user?.password || "123456",
		};
	}

	async function createValidUser() {
		await connection.query(
			`INSERT INTO users (name, email,address,cpf, password) VALUES ('testonaldo', 'teste@gmail.com', 'rua das largatixas 33', '00000000000', 'teste');`
		);
	}

	it("returns 201 for valid params", async () => {
		const body = generateSignUpBody();

		const result = await agent.post("/signup").send(body);

		const status = result.status;
		expect(status).toEqual(201);
	});

	it("returns 409 for duplicated user e-mail", async () => {
		await createValidUser();
		const body = generateSignUpBody({ email: "teste@gmail.com" });

		const result = await agent.post("/signup").send(body);
		const status = result.status;
		expect(status).toEqual(409);
	});

	it("returns 409 for duplicated user cpf", async () => {
		await createValidUser();
		const body = generateSignUpBody({ cpf: "00000000000" });

		const result = await agent.post("/signup").send(body);
		const status = result.status;
		expect(status).toEqual(409);
	});

	it("returns 400 if cpf does not match the requirements (11 numeric digits)", async () => {
		const body = generateSignUpBody({ cpf: "400" });

		const result = await agent.post("/signup").send(body);
		const status = result.status;
		expect(status).toEqual(400);
	});
});
