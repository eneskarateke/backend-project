const db = require("../../../data/dbConfig");

module.exports = async (req, res, next) => {
  const { id_follower } = req.body;
  const id_user = req.params.id;

  try {
    const count = await db("followers")
      .where({ id_user, id_follower })
      .count("id_user as count")
      .first();

    if (count.count > 0) {
      return res.status(400).json({ error: "User is already being followed." });
    }

    next();
  } catch (error) {
    next(error);
  }
};
