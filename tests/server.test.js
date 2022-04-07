const SequelizeMock = require("sequelize-mock");
const dbMock = new SequelizeMock();
// mock the statsd client
const statsdMock = {
  increment: () => {},
};

// mock the winston logger
const loggerMock = {
  info: () => {},
  error: () => {},
};

// mock the s3 provider
const s3ProviderMock = {
  upload: () => {},
};

const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);
const request = require("supertest");

test("GET healthz endpoint", async () => {
  await request(app).get("/healthz").expect(200);
});

test("GET random not found endpoint", async () => {
  await request(app).get("/randomendpoint").expect(404);
});
