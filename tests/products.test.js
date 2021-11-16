/* eslint-disable no-undef */
import "../src/setup.js";
import app from "../src/app.js";
import supertest from "supertest";
import connection from "../src/database/database.js";

describe("GET /products", () => {
	it("returns status 201 for valid request", async () => {
		const result = await supertest(app).get("/products");
		expect(result.status).toEqual(201);
	});
});

describe("GET /singleProduct/2", () => {
	it("returns status 201 for valid request", async () => {
		const result = await supertest(app).get("/singleProduct/2");
		expect(result.status).toEqual(201);
	});
});

afterAll(() => {
	connection.end();
});
