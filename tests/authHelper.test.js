const {
  getUserPasswordAuth,
  hashifyPassword,
  comparePassword,
} = require("../utils/authHelpers");

test("Test User Password base64 decoding", async () => {
  const authHeader = "Basic dXNlcm5hbWU6cGFzc3dvcmQ=";
  const { username, password } = await getUserPasswordAuth(authHeader);
  expect(username).toBe("username");
  expect(password).toBe("password");
});

test("Test Hashifying and comparePassword", async () => {
  let password = "password";
  const hashedPassword = await hashifyPassword(password);
  expect(hashedPassword).not.toBe(password);

  const comparePasswordResult = await comparePassword(password, hashedPassword);
  expect(comparePasswordResult).toBe(true);

  password = "wrongPassword";
  const comparePasswordResult2 = await comparePassword(
    password,
    hashedPassword
  );
  expect(comparePasswordResult2).toBe(false);
});
