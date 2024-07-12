const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helpers = require("./test_helpers");
const app = require("../app");

const api = supertest(app);

describe("When there is initially one user in db", () => {
  beforeEach(async () => {
    await helpers.clearAndCreateUserRoot();
  });

  test("succeeds with valid data", async () => {
    const usersAtStart = await helpers.usersInDb();

    await api
      .post("/api/users")
      .send(helpers.newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helpers.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    assert(usernames.includes(helpers.newUser.username));
  });

  describe("creation fails with proper statuscode and message", () => {
    test("if username already taken", async () => {
      const usersAtStart = await helpers.usersInDb();

      const newUser = {
        username: "root",
        password: "rootPass",
        name: "Name Root Duplicate",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("Expected username to be unique"));

      const usersAtEnd = await helpers.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("if username missing", async () => {
      const usersAtStart = await helpers.usersInDb();

      const newUser = {
        password: "rootPass",
        name: "Name Root Without Username",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("User validation failed: username: Path `username` is required."));

      const usersAtEnd = await helpers.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("if username length is incorrect", async () => {
      const usersAtStart = await helpers.usersInDb();

      const newUser = {
        username: "ro",
        password: "rootPass",
        name: "Name Root Short",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("User validation failed: username: Path `username`"));
      assert(result.body.error.includes("is shorter than the minimum allowed length"));

      const usersAtEnd = await helpers.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("if password missing", async () => {
      const usersAtStart = await helpers.usersInDb();

      const newUser = {
        username: "testPass",
        name: "Name User Without Password",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(result.body.error.includes("User validation failed: `password` is required."));

      const usersAtEnd = await helpers.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });

    test("if password length is incorrect", async () => {
      const usersAtStart = await helpers.usersInDb();

      const newUser = {
        username: "testPass",
        password: "ro",
        name: "Name User Short Password",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert(
        result.body.error.includes(
          "User validation failed: password: Path `password` is shorter than the minimum allowed length"
        )
      );

      const usersAtEnd = await helpers.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
