const request = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

let tokenUser1; // Token for user 1
let tokenUser2; // Token for user 2

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();

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

afterAll(async () => {
  await db.destroy();
});

test("[0] sanity check", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

describe("AUTH", () => {
  test("[1] register success", async () => {
    const payload = { username: "enes", password: "1234" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("user_id", 3);
  });

  test("[2] register success", async () => {
    const payload = { username: "hamza", password: "1234" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("username", "hamza");
  });

  test("[3] register failure", async () => {
    const payload = { username: "enes", password: "12345" };
    const res = await request(server).post("/api/auth/register").send(payload);
    expect(res.body).toHaveProperty("message", "User zaten tanımlı");
  });

  test("[4] login success", async () => {
    const payload = { username: "enes", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("message", "welcome enes");
  });

  test("[5] login failure", async () => {
    const payload = { username: "mahmut", password: "1234" };
    const res = await request(server).post("/api/auth/login").send(payload);
    expect(res.body).not.toHaveProperty("token");
    expect(res.body).not.toHaveProperty("message", "welcome enes");
  });
});

describe("TWEETS", () => {
  test("[6] can't get tweets without token", async () => {
    const res = await request(server).get("/api/tweets/");
    expect(res.body).toHaveProperty("message", "Token gereklidir");
  });

  test("[7] get tweets with token", async () => {
    const payload = { username: "enes", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);

    const res = await request(server)
      .get("/api/tweets")
      .set("Authorization", loginRes.body.token);
    expect(res.body).toHaveLength(0);
  });

  test("[8] post tweets", async () => {
    const payload = { username: "enes", password: "1234" };
    const loginRes = await request(server)
      .post("/api/auth/login")
      .send(payload);
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

describe("FOLLOWERS", () => {
  test("[9] get followers", async () => {
    const res = await request(server)
      .get("/api/followers/1")
      .set("Authorization", tokenUser1);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("followers");
    expect(res.body.followers.user_id).toBe(1);
  });

  test("[10] create follower", async () => {
    const res = await request(server)
      .post("/api/followers/1")
      .set("Authorization", tokenUser2)
      .send({ id_follower: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Follower created successfully."
    );
  });

  test("[11] delete follower", async () => {
    const res = await request(server)
      .delete("/api/followers/1")
      .set("Authorization", tokenUser2)
      .send({ id_follower: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Follower deleted successfully."
    );
  });
});

describe("LIKES", () => {
  test("[12] create like", async () => {
    const res = await request(server)
      .post("/api/likes/1")
      .set("Authorization", tokenUser2)
      .send({ liked_id: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id_like", 1);
  });
  test("[13] create like again", async () => {
    const res = await request(server)
      .post("/api/likes/1")
      .set("Authorization", tokenUser2)
      .send({ liked_id: 3 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id_like", 2);
  });

  test("[14] olmayan tweeti likelamak", async () => {
    const res = await request(server)
      .post("/api/likes/2")
      .set("Authorization", tokenUser2)
      .send({ liked_id: 3 });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Tweet couldn't found!");
  });

  test("[15] undo like", async () => {
    const res = await request(server)
      .delete("/api/likes/1")
      .set("Authorization", tokenUser2)
      .send({ liked_id: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Like has been undone!");
  });

  test("[16] liking liked tweet again", async () => {
    const res = await request(server)
      .post("/api/likes/1")
      .set("Authorization", tokenUser2)
      .send({ liked_id: 3 });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty(
      "message",
      "You have already liked this tweet"
    );
  });
});

describe("COMMENTS", () => {
  test("[17] create comment", async () => {
    const res = await request(server)
      .post("/api/comments/1")
      .set("Authorization", tokenUser2)
      .send({ commented_id: 2, comment_text: "test comment" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id_comment", 1);
    expect(res.body).toHaveProperty("tweeted_id", 1);
    expect(res.body).toHaveProperty("comment_text", "test comment");
  });

  test("[18] olmayan tweete comment denemesi", async () => {
    const res = await request(server)
      .post("/api/comments/2")
      .set("Authorization", tokenUser2)
      .send({ commented_id: 2, comment_text: "test comment" });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "Tweet couldn't found!");
  });

  test("[20] delete comment", async () => {
    const res = await request(server)
      .delete("/api/comments/1")
      .set("Authorization", tokenUser2);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Comment deleted successfully.");
  });
});
