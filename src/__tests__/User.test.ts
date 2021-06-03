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
let connectionStatus: boolean = false;

describe("User test", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    connectionStatus = connection.isConnected;
    await connection.runMigrations();
  });

  it("should be to connected on database test", () => {
    expect(connectionStatus).toBe(true);
  });

  it("should be to create a new user", async () => {
    const response = await request(app)
      .post("/users/create")
      .send(userTestCreate);

    expect(response.status).toBe(201);
  });

  it("should be to list an user", async () => {
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

  it("should be to removed user", async () => {
    const responseListUser = await request(app).get("/users/list");
    const [responseParse] = JSON.parse(responseListUser.text);
    const response = await request(app).delete(
      `/users/delete/${responseParse.id}`
    );

    expect(response.status).toBe(200);
    expect(responseParse.text).toBeFalsy();
  });
});
