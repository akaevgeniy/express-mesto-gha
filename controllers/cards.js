const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-req-err");
const NoRightError = require("../errors/right-err");

// контроллер получения всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(["owner", "likes"])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};
// создание новой карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      next(err);
    })
    .catch(next);
};
// удаление карточки по ид
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError("Карточка по заданному id отсутствует в базе"))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new NoRightError("Нет прав для удаления данной карточки");
      }

      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(new NotFoundError("Карточка по заданному id отсутствует в базе"))
        .then(() => res.send({ message: "Пост был удален" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Невалидный id ");
      }
      next(err);
    })
    .catch(next);
};
// постановка лайка карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(new NotFoundError("Карточка по заданному id отсутствует в базе"))
    .populate(["owner", "likes"])
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      next(err);
    })
    .catch(next);
};
// снятие лайка (дизлайк) с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(new NotFoundError("Карточка по заданному id отсутствует в базе"))
    .populate(["owner", "likes"])
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
      next(err);
    })
    .catch(next);
};
