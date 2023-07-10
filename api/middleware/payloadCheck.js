module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(401).json({ message: "username ve şifre gereklidir" });
  } else {
    next();
  }
};
