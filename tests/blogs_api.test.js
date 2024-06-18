const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const supertest = require("supertest");
const helpers = require("./test_helpers");
const app = require("../app");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helpers.initialTestBlogs);
});

describe("API Blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helpers.initialTestBlogs.length);
  });

  test("identifier property is named id", async () => {
    await api.get("/api/blogs").expect((res) => {
      if (!res.body[0].id) throw new Error("missing id key");
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
