const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const ERROR_CODE = 500;
const ERROR_NOT_CODE = 404;
const ERROR_BAD_CODE = 400;
// функция, обрабатывающая ошибку сервера по умолчанию
const parseError = (res) => {
  res.status(ERROR_CODE).send({ message: "Произошла ошибка сервера" });
};
// контроллер для получения всех пользоватлей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(parseError);
};
// контроллер для получения конкретного пользователя по ид
module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_CODE).send({ message: "Невалидный id " });
      }
      if (err.name === "NotFound") {
        return res.status(ERROR_NOT_CODE).send({ message: err.message });
      }
      return parseError();
    });
};
// контроллер для создания нового пользоватля, в тело передаются три параметра
module.exports.createUser = (req, res) => {
  const {
    email, password
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      }
      return parseError();
    });
};
// обновление инфы о пользователе (имя и о себе)
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      // обработчик then получит на вход обновлённую запись/проверка ошибки валидации
    }
  )
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      }
      if (err.name === "NotFound") {
        return res.status(ERROR_NOT_CODE).send({ message: err.message });
      }
      return parseError();
    });
};
// обновление аватара пользователя
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
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      }
      if (err.name === "NotFound") {
        return res.status(ERROR_NOT_CODE).send({ message: err.message });
      }
      return parseError();
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
// контроллер для получения данных о текущем пользователе
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error(
        "Пользователь по заданному id отсутствует в базе"
      );
      error.name = "NotFound";
      throw error;
    })
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(ERROR_BAD_CODE).send({ message: "Невалидный id" });
      }
      if (err.name === "NotFound") {
        return res.status(ERROR_NOT_CODE).send({ message: err.message });
      }
      return parseError();
    });
};
