const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
const app = require("../app")(dbMock);
const request = require("supertest");

//
test("GET healthz endpoint", async () => {
  await request(app).get("/health").expect(200);
});

test("GET random not found endpoint", async () => {
  await request(app).get("/randomendpoint").expect(404);
});
