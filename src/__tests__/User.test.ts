import request from "supertest";
import { app } from "../app";
import createConnection from "../database";

const userTestCreate = {
  name: "user unit test",
  email: "user@uniteste.com",
};
const userTestUpdate = {
  name: "user unit test",
  email: "user@uniteste.com",
};

describe("User test", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  it("Should be to create a new user", async () => {
    const response = await request(app)
      .post("/users/create")
      .send(userTestCreate);

    expect(response.status).toBe(201);
  });

  it("Should be to list an user", async () => {
    const response = await request(app).get("/users/list");
    const [responseParse] = JSON.parse(response.text);

    expect(response.status).toBe(200);
    expect(responseParse.name).toBe(userTestCreate.name);
  });

  it("should be to update user", async () => {
    const responseListUser = await request(app).get("/users/list");
    const [responseParse] = JSON.parse(responseListUser.text);
    const response = await request(app)
      .patch(`/users/update/${responseParse.id}`)
      .send(userTestUpdate);

    expect(response.status).toBe(200);
    expect(responseParse.name).toBe(userTestUpdate.name);
  });
});
