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
  test("[1] register", async () => {
    const payload = { username: "serkan", password: "1234" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("user_id", 1);
  });
  test("[2] register failure", async () => {
    const payload = { username: "serkan", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("message", "User zaten tanımlı");
  });
  test("[3] login", async () => {
    const payload = { username: "serkan", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "welcome serkan");
  });
  test("[4] login failure", async () => {
    const payload = { username: "mahmut", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).not.toHaveProperty("token");
    expect(res.body).not.toHaveProperty("message", "welcome serkan");
  });
});

describe("Tweets", () => {
  test("[5] get tweets", async () => {
    const res = await request(server).get("/api/tweets/");
    expect(res.body).toHaveProperty("message", "Token gereklidir");
  });
  test("[6] get tweets", async () => {
    const payload = { username: "serkan", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
    //expect(loginRes.body.token.username).toBe('serkan')

    const res = await request(server)
      .get("/api/tweets")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(0);
  });
  test("[7] post tweets", async () => {
    const payload = { username: "serkan", password: "1234" };
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
});
