import setup from "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";
import { createUser } from "./factories/userFactory.js";
import { createSession } from "./factories/sessionFactory.js";

const agent = supertest(app);

describe("GET /cart", () => {
	beforeAll(async () => {
		await connection.query("DELETE FROM cart_products;");
		await connection.query("DELETE FROM carts;");
	});

	afterAll(async () => {
		await connection.query("DELETE FROM product;");
		await connection.query("DELETE FROM cart_products;");
		await connection.query("DELETE FROM carts;");
		await connection.query("DELETE FROM sessions;");
		await connection.query("DELETE FROM users;");
		connection.end();
	});

	afterEach(async () => {
		await connection.query("DELETE FROM cart_products;");
		await connection.query("DELETE FROM carts;");
		await connection.query("DELETE FROM sessions;");
		await connection.query("DELETE FROM users;");
	});

	it("returns 200 for accessing an existing cart", async () => {
		const user = await createUser();

		const session = await createSession(user);
		await connection.query(`INSERT INTO carts ("userId") VALUES ($1);`, [user.id]);
		const result = await agent.get("/cart").set({ Authorization: `Bearer ${session.token}` });
		expect(result.status).toEqual(200);
	});

	it("returns 201 for accessing a new cart", async () => {
		const user = await createUser();
		const session = await createSession(user);

		const result = await agent.get("/cart").set({ Authorization: `Bearer ${session.token}` });
		expect(result.status).toEqual(200);
	});
});
