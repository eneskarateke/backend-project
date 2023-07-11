const db = require("../../data/dbConfig.js");

function findAll() {
  return db("users").select("username", "user_id").orderBy("user_id", "asc");
}

function getByFilter(filtre) {
  return db("users").where(filtre);
}

function getById(id) {
  return db("users").select("user_id", "username").where("user_id", id).first();
}

async function addUser(payload) {
  const [user_id] = await db("users").insert(payload);
  const user = await getById(user_id);
  return user;
}

module.exports = {
  findAll,
  getByFilter,
  getById,
  addUser,
};
