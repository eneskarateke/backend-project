const db = require("../../data/dbConfig.js");

async function createFollower(userId, followerId) {
  const [newFollowerId] = await db("followers").insert({
    id_user: userId,
    id_follower: followerId,
  });

  return newFollowerId;
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

  const followedUser = await getUserById(userId);

  return {
    user_id: Number(userId),
    username: followedUser.username,
    followers,
  };
}

async function getUserById(userId) {
  const user = await db("users").where("user_id", userId).first();
  return user;
}

module.exports = {
  createFollower,
  deleteFollower,
  getFollowers,
  getUserById,
};
