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

// describe("GET /api/topics", () => {
//   test("200: Responds with an object detailing the documentation for each endpoint", () => {
//     return request(app)
//       .get("/api")
//       .expect(200)
//       .then(({ body: { endpoints } }) => {
//         expect(endpoints).toEqual(endpointsJson);
//       });
//   });
// });
