const cardsRouter = require("express").Router();
//импортируем контроллеры и добавляем их в качестве колбэков в методы роутов карточек
const {
  getCards,
  deleteCard,
  createCard,
  dislikeCard,
  likeCard,
} = require("../controllers/cards");

cardsRouter.get("/cards", getCards);

cardsRouter.delete("/cards/:cardId", deleteCard);

cardsRouter.post("/cards", createCard);

cardsRouter.delete("/cards/:cardId/likes", dislikeCard);

cardsRouter.put("/cards/:cardId/likes", likeCard);

module.exports = cardsRouter;
