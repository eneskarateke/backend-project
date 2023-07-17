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
      next();
    } else {
      return res
        .status(400)
        .json({ error: "User is not already being followed." });
    }
  } catch (error) {
    next(error);
  }
};
