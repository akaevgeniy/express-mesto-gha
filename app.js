const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
// middleware, назначающий каждому вызову в запрос захардкоденный ид пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "6217840c8fcbe148c884c157",
  };

  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// соединяемся с БД на локальном порту
mongoose.connect("mongodb://localhost:27017/mestodb", (err) => {
  if (err) throw err;
  console.log("connected to MongoDB");
});

app.use(userRouter);
app.use(cardsRouter);
// запуск сервера, слушаем порт
app.listen(PORT, () => {
  console.log("Run server...", PORT);
});
