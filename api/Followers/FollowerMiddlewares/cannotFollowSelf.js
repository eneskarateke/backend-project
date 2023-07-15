module.exports = async (req, res, next) => {
  const { id_follower } = req.body;
  const id_user = req.params.id;

  if (Number(id_user) === Number(id_follower)) {
    res.status(400).json({ error: "User cannot follow themselves." });
  } else {
    next();
  }
};
