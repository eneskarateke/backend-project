const router = require("express").Router();
const Users = require("./users-model.js");

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kimlik kontrolü yapılmış kullanıcılar
  erişebilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    }
  ]
 */
router.get("/", (req, res, next) => {
  // hazır
  Users.findAll()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  // hazır
  Users.getById(req.params.id)
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

module.exports = router;
