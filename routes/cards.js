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

cardsRouter.delete("/cards/:cardId", deleteCard);

cardsRouter.post("/cards", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }).unknown(true),
}), createCard);

cardsRouter.delete("/cards/:cardId/likes", dislikeCard);

cardsRouter.put("/cards/:cardId/likes", likeCard);

module.exports = cardsRouter;
