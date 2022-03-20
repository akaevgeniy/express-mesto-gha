const cardsRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
// импортируем контроллеры и добавляем их в качестве колбэков в методы роутов карточек
const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);

cardsRouter.delete("/cards/:cardId", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), deleteCard);
// валидируем приходящие на сервер данные
// Если тело запроса не пройдёт валидацию, контроллеры не запустятся
cardsRouter.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/),
  }),
}), createCard);

cardsRouter.delete("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), dislikeCard);

cardsRouter.put("/cards/:cardId/likes", celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), likeCard);

module.exports = cardsRouter;
