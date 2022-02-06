const app = require("../app");
const supertest = require("supertest");

test("GET healthz endpoint", async () => {
  await supertest(app)
    .get("/spring2022-csye6225/app/1.0.0/healthz")
    .expect(200);
});

test("GET random not found endpoint", async () => {
  await supertest(app).get("/randomendpoint").expect(404);
});
