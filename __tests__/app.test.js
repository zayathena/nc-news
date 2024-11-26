const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const app = require("../app")

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics with the following properties: slugs and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        expect(topics[0]).toHaveProperty("slug");
        expect(topics[0]).toHaveProperty("description")
      });
  });
  test("200: responds with an empty array if no topics are found", () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({ body: { topics } }) => {
    expect(topics.length).toBeGreaterThan(0);
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object with the correct properties", () => {
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({ body }) => {
      const article = body.article; 
      expect(article).toMatchObject({ 
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String) })
      });
    });
  
  test("404: responds with a 404 error when an invalid article id is entered", () => {
    return request(app)
    .get('/api/articles/999')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article not found");
    });
  });
  test("400: responds with 400 error if non-numeric id is entered", () => {
    return request(app)
    .get('/api/articles/mitch')
    .expect(400)
    .then(({ body }) => {
    expect(body.msg).toBe("Invalid article ID");
    });
  })
});

describe.only("GET /api/articles", () => {
  test("200: should respond with an array of object articles with the correct properties", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: articles should not contain a body property", () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body: { articles } }) => {
    articles.forEach((article) => {
    expect(article).not.toHaveProperty("body");
      });
    });
  });
  test("200: articles should be sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
    });
  test("400: responds with an error when there is an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_column")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort_by query");
        });
  });
  test("400: responds with an error when there is an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  }); 
});
