const userRouter = require("express").Router();
// импортируем контроллеры и добавляем их в качестве колбэков в методы роутов пользователя
const {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

userRouter.get("/users", getUsers);

userRouter.get("/users/:userId", getUserId);

userRouter.post("/users", createUser);

userRouter.patch("/users/me", updateUser);

userRouter.patch("/users/me/avatar", updateAvatar);

module.exports = userRouter;
