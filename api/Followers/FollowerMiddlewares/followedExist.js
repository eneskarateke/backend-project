const UserModel = require("../../Users/users-model");

module.exports = async (req, res, next) => {
  const user = UserModel.getById(req.params.id);

  if (!user) {
    res.status(400).json({ message: "User could not found!" });
  } else {
    next();
  }
};
