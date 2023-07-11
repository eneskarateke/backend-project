const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

test("[0] sanity check", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("AUTH", () => {
  test("[1] register success", async () => {
    const payload = { username: "enes", password: "1234" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("user_id", 1);
    expect(res.body).toHaveProperty("username", "enes");
  });
  test("[2] register failure", async () => {
    const payload = { username: "enes", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("message", "User zaten tanımlı");
  });
  test("[3] login success", async () => {
    const payload = { username: "enes", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "welcome enes");
  });
  test("[4] login failure", async () => {
    const payload = { username: "mahmut", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).not.toHaveProperty("token");
    expect(res.body).not.toHaveProperty("message", "welcome enes");
  });
});

describe("Tweets", () => {
  test("[5] can't get tweets without token", async () => {
    const res = await request(server).get("/api/tweets/");
    expect(res.body).toHaveProperty("message", "Token gereklidir");
  });
  test("[6] get tweets with token", async () => {
    const payload = { username: "enes", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);

    const res = await request(server)
      .get("/api/tweets")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(0);
  });
  test("[7] post tweets", async () => {
    const payload = { username: "enes", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
    //expect(loginRes.body.token.username).toBe('serkan')
    const tweetPayload = { tweet: "test" };
    const res = await request(server)
      .post("/api/tweets/1")
      .set("Authorization", loginRes.body.token)
      .send(tweetPayload);
    expect(res.body).toHaveProperty("tweet", "test");
  });

  test("[bonus] get tweets with token", async () => {
    const payload = { username: "enes", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);

    const res = await request(server)
      .get("/api/tweets")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(1);
  });
});

describe("followers", () => {
  let tokenUser1; // Token for user 1
  let tokenUser2; // Token for user 2

  beforeAll(async () => {
    // Register user 1
    const payloadUser1 = { username: "user1", password: "1234" };
    await request(server).post("/api/auth/register").send(payloadUser1);

    // Login user 1
    const loginResUser1 = await request(server)
      .post("/api/auth/login")
      .send(payloadUser1);
    tokenUser1 = loginResUser1.body.token;

    // Register user 2
    const payloadUser2 = { username: "user2", password: "1234" };
    await request(server).post("/api/auth/register").send(payloadUser2);

    // Login user 2
    const loginResUser2 = await request(server)
      .post("/api/auth/login")
      .send(payloadUser2);
    tokenUser2 = loginResUser2.body.token;
  });

  test("[8] get followers", async () => {
    const res = await request(server)
      .get("/api/followers/1")
      .set("Authorization", tokenUser1);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("followers");
    expect(Array.isArray(res.body.followers)).toBe(true);
  });

  test("[9] create follower", async () => {
    const res = await request(server)
      .post("/api/followers")
      .set("Authorization", tokenUser2)
      .send({ id_user: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Follower created successfully."
    );
  });

  test("[10] delete follower", async () => {
    const res = await request(server)
      .delete("/api/followers")
      .set("Authorization", tokenUser2)
      .send({ id_user: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Follower deleted successfully."
    );
  });
});
