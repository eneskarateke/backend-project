module.exports = async (req, res, next) => {
  const { id_follower, id_user } = req.body;
  if (!id_follower || !id_user) {
    res.status(401).json({ message: "follower id ve user id gereklidir" });
  } else {
    next();
  }
};
