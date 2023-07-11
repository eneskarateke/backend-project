const db = require("../../data/dbConfig.js");

async function createFollower(userId, followerId, next) {
  try {
    await db("followers").insert({ id_user: userId, id_follower: followerId });
    return true;
  } catch (error) {
    next(error);
  }
}

async function deleteFollower(userId, followerId) {
  try {
    await db("followers")
      .where({ id_user: userId, id_follower: followerId })
      .del();
    return true;
  } catch (error) {
    next(error);
  }
}

async function getFollowers(userId) {
  try {
    const followers = await db("followers")
      .where("id_user", userId)
      .join("users", "users.user_id", "=", "followers.id_follower")
      .select("users.user_id", "users.username");

    return followers;
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createFollower,
  deleteFollower,
  getFollowers,
};
