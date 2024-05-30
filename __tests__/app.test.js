const request = require("supertest");
const app = require("../app.js");
const jestSorted = require("jest-sorted");

const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const endpoints = require("../endpoints.json");

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

  test("404: responds with 'Route not found' for invalid endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Route not found");
      });
  });

  test.skip("200: test for this endpoint responding with an accurate endpoint JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: responds with article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });

  test("404: responds with Article not found for invalid id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with 'Bad request' for invalid id", () => {
    return request(app)
      .get("/api/articles/itisnotid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("200: responds with an array of articles that join with comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).not.toHaveLength(0);
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  test("200: articles are sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("200: comments are sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("404: responds with 'Article not found' for invalid article_id", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with 'Bad request' for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/nonsense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("Patch /api/articles/:article_id", () => {
  test("200: responds with the updated article", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", 101);
      });
  });

  test("200: responds with the updated article after decrementing votes", () => {
    const newVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", 1);
      });
  });

  test("400: responds with 'Bad request' for an invalid article_id", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/nonsense")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("400: responds with 'Bad request' for a malformed body", () => {
    const newVote = { inc_votes: "nonsense" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: responds with 'Article not found' for a valid but non-existent article_id", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/9999")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });
});

// describe("", () => {
//   test("", () => {});
// });

// extra work that Hannah said can be removed, but I want to keep it in case I will need it again
// test("400: responds with 'Invalid query' for invalid sort_by query", () => {
//   return request(app)
//     .get("/api/articles?sort_by=nonsense")
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("Invalid query");
//     });
// });

// test("400: responds with 'Invalid query' for invalid order query", () => {
//   return request(app)
//     .get("/api/articles?order=nonsense")
//     .expect(400)
//     .then((response) => {
//       expect(response.body.msg).toBe("Invalid query");
//     });
// });
