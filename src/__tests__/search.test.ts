import request from "supertest";
import { app } from "../app";
import createConnection from "../database";

const userTestCreate = {
  title: "user unit test",
  description: "description user test",
};
const userTestUpdate = {
  title: "updated user unit test",
  description: "updated description user test",
};
let connectionStatus: boolean = false;

describe("Search test", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    connectionStatus = connection.isConnected;
    await connection.runMigrations();
  });

  it("should be to connected on database test", () => {
    expect(connectionStatus).toBe(true);
  });

  it("should be to create a new search", async () => {
    const response = await request(app)
      .post("/search/create")
      .send(userTestCreate);

    expect(response.status).toBe(201);
  });

  it("should be to list all search", async () => {
    const response = await request(app).get("/search/list");
    const [responseParse] = JSON.parse(response.text);
    expect(response.status).toBe(200);
    expect(responseParse.title).toBe(userTestCreate.title);
  });

  it("should be to update an search", async () => {
    const searchs = await request(app).get("/search/list");
    const [searchParse] = JSON.parse(searchs.text);
    const updatedSearch = await request(app)
      .patch(`/search/${searchParse.id}/update`)
      .send(userTestUpdate);
    const response = await request(app).get("/search/list");
    const [responseParse] = JSON.parse(response.text);

    console.log("teste", responseParse);

    expect(updatedSearch.status).toBe(200);
    expect(responseParse.title).toBe(userTestUpdate.title);
  });

  it("should be to removed an search", async () => {
    const searchs = await request(app).get("/search/list");
    const [searchParse] = JSON.parse(searchs.text);
    const response = await request(app).delete(
      `/search/${searchParse.id}/delete`
    );

    expect(response.status).toBe(200);
  });
});
