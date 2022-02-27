const Card = require("../models/card");
const ERROR_CODE = 500;
const ERROR_NOT_CODE = 404;
const ERROR_BAD_CODE = 400;
//функция, обрабатывающая ошибку сервера по умолчанию
const parseError = (res) => {
  res.status(ERROR_CODE).send({ message: "Произошла ошибка сервера" });
};
//контроллер получения всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch(parseError);
};
//создание новой карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};
//удаление карточки по ид
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ message: "Пост был удален" }))
    .orFail(() => {
      const error = new Error("Карточка по заданному id отсутствует в базе");
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BAD_CODE).send({ message: "Невалидный id " });
      } else return parseError();
    });
};
//постановка лайка карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => res.send({ data: card }))
    .orFail(() => {
      const error = new Error("Карточка по заданному id отсутствует в базе");
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};
//снятие лайка (дизлайк) с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .populate(["owner", "likes"])
    .then((card) => res.send({ data: card }))
    .orFail(() => {
      const error = new Error("Карточка по заданному id отсутствует в базе");
      error.name = "NotFound";
      throw error;
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(ERROR_BAD_CODE).send({
          message: "Переданы некорректные данные",
        });
      else return parseError();
    });
};