const db = require("../../data/dbConfig.js");

async function createFollower(userId, followerId) {
  const followers = await db("followers").insert({
    id_user: userId,
    id_follower: followerId,
  });
  return followers;
}

async function deleteFollower(userId, followerId) {
  const follower = await db("followers")
    .where({ id_user: userId, id_follower: followerId })
    .del();
  return follower;
}

async function getFollowers(userId) {
  const followers = await db("followers")
    .where("id_user", userId)
    .join("users", "users.user_id", "=", "followers.id_follower")
    .select("users.user_id", "users.username");

  return followers;
}

module.exports = {
  createFollower,
  deleteFollower,
  getFollowers,
};
