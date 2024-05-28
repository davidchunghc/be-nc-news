const request = require("supertest");
const app = require("../app.js");

const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/healthcheck", () => {
  test("200: response with the right status code", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
});

describe("/api/topics", () => {
  test("200: responds with an array of topics which have properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });

  test("400: responds with bad request for invalid endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

// describe("", () => {
//   test("", () => {});
// });
