import app from "../src/app.js";
import supertest from "supertest";
import "../src/setup.js";

describe("GET /products", () => {
  it("returns status 201 for successful request", async () => {
    const result = await supertest(app).get("/products");
    expect(result.status).toEqual(201);
  });
});
