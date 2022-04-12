const SequelizeMock = require("sequelize-mock");
const request = require("supertest");
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

test("GET user endpoint happy path", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .get("/v1/user/self")
    .auth("test@test.com", "test12345")
    .expect(200)
    .then((response) => {
      // Verify the response header type
      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );

      // Verify the response username
      expect(response.body.username).toBe("test@test.com");

      // Verify the response first_name
      expect(response.body.first_name).toBe("Tim");

      // Verify the response last_name
      expect(response.body.last_name).toBe("Mcgraw");

      // Verify the response id
      expect(response.body.id).toBe("d145283a-2990-44b8-969a-76e1a0327305");
    });
});

test("GET user endpoint wrong password or empty auth header", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .get("/v1/user/self")
    .auth("test@test.com", "wrongpassword")
    .expect(401)
    .then((response) => {
      // Verify the response username
      expect(response.body.message).toBe(
        "Unauthorized: Invalid username or password"
      );
    });

  await request(app)
    .get("/v1/user/self")
    .expect(401)
    .then((response) => {
      // Verify the response username
      expect(response.body.message).toBe("Missing authorization header");
    });
});

test("POST (Create) user endpoint Happy Path", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .post("/v1/user")
    .send({
      username: "Leo.Schneider38@gmail.com",
      password: "test12345",
      first_name: "Deshaun",
      last_name: "Stokes",
    })
    .set("Accept", "application/json")
    .expect(201)
    .then((response) => {
      // Verify the response header type
      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );

      // Verify the response username
      expect(response.body.username).toBe("Leo.Schneider38@gmail.com");

      // Verify the response first_name
      expect(response.body.first_name).toBe("Deshaun");

      // Verify the response last_name
      expect(response.body.last_name).toBe("Stokes");
    });
});

test("POST (Create) user endpoint request body without username", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .post("/v1/user")
    .send({
      password: "test12345",
      first_name: "Deshaun",
      last_name: "Stokes",
    })
    .set("Accept", "application/json")
    .expect(400)
    .then((response) => {
      // Verify the response header type
      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );

      // Verify the response message
      expect(response.body.message).toBe(
        "username, password, first_name, and last_name are required"
      );
    });
});

test("PUT (Update) user endpoint request with changed first name and last name", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .put("/v1/user/self")
    .auth("test@test.com", "test12345")
    .send({
      first_name: "Deshaun",
      last_name: "Stokes",
    })
    .set("Accept", "application/json")
    .expect(204);
});

test("PUT (Update) user endpoint request with bad request scenarios", async () => {
  const dbMock = new SequelizeMock();
  dbMock.define("User", {
    username: `test@test.com`,
    first_name: `Tim`,
    last_name: `Mcgraw`,
    password: "$2a$12$EtAI3xfiMKIB0g15OS613OuuxjWQ1t43Hh5/N.T1bmdmBVDsNRi82",
    account_created: new Date(),
    account_updated: new Date(),
    id: `d145283a-2990-44b8-969a-76e1a0327305`,
  });

  const app = require("../app")(dbMock, s3ProviderMock, loggerMock, statsdMock);

  await request(app)
    .put("/v1/user/self")
    .auth("test@test.com", "test12345")
    .send({
      username: "test@gmail.com",
    })
    .set("Accept", "application/json")
    .expect(400)
    .then((response) => {
      // Verify the response header type
      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );

      // Verify the response message
      expect(response.body.message).toBe(
        "id, username, account_created, and account_updated cannot be set"
      );
    });

  // Testing the scenario where request body is empty
  await request(app)
    .put("/v1/user/self")
    .auth("test@test.com", "test12345")
    .send({})
    .set("Accept", "application/json")
    .expect(400)
    .then((response) => {
      // Verify the response header type
      expect(response.headers["content-type"]).toBe(
        "application/json; charset=utf-8"
      );

      // Verify the response message
      expect(response.body.message).toBe(
        "password, first_name, or last_name are required"
      );
    });
});
