const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const supertest = require("supertest");
const helpers = require("./test_helpers");
const app = require("../app");

const api = supertest(app);

describe("When there is initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    //console.log("DB Test cleared");
    await Blog.insertMany(helpers.initialTestBlogs);
    //console.log("DB initial test blogs saved");
  });

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

  describe("addition of a new blog", () => {
    test("succeeds with valid data", async () => {
      await api
        .post("/api/blogs")
        .send(helpers.newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
        .expect((response) => {
          assert.strictEqual(response.body.title, helpers.newBlog.title);
        });

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, helpers.initialTestBlogs.length + 1);
    });

    test("without the likes property then likes equals 0", async () => {
      await api
        .post("/api/blogs")
        .send(helpers.newBlogWithoutLikes)
        .expect(201)
        .expect("Content-Type", /application\/json/)
        .expect((response) => {
          assert.strictEqual(response.body.likes, 0);
        });
    });

    test("bad request 400 without title or url property", async () => {
      await api.post("/api/blogs").send(helpers.newBlogWithoutTitle).expect(400);

      await api.post("/api/blogs").send(helpers.newBlogWithoutUrl).expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
