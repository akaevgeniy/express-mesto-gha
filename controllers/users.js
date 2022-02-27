const User = require("../models/user");
const ERROR_CODE = 500;
const ERROR_NOT_CODE = 404;
const ERROR_BAD_CODE = 400;
//функция, обрабатывающая ошибку сервера по умолчанию
const parseError = (res) => {
  res.status(ERROR_CODE).send({ message: "Произошла ошибка сервера" });
};
//контроллер для получения всех пользоватлей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(parseError);
};
//контроллер для получения конкретного пользователя по ид
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) =>
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      })
    )
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BAD_CODE).send({ message: "Невалидный id " });
      } else return parseError();
    });
};
////контроллер для создания нового пользоватля, в тело передаются три параметра
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) =>
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};
//обновление инфы о пользователе (имя и о себе)
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true, // обработчик then получит на вход обновлённую запись/проверка ошибки валидации
    }
  )
    .then((user) =>
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      })
    )
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};
//обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) =>
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      })
    )
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};
