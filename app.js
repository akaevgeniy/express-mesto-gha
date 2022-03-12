const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const {
  createUser,
  login
} = require("./controllers/users");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.post("/signin", login);

app.post("/signup", createUser);
// middleware, назначающий каждому вызову в запрос захардкоденный ид пользователя
// app.use((req, res, next) => {
//   req.user = {
//     _id: "622253bec6d7adf2d66aa69a",
//   };

//   next();
// });
app.use(auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// соединяемся с БД на локальном порту
mongoose.connect("mongodb://localhost:27017/mestodb", (err) => {
  if (err) throw err;
  console.log("connected to MongoDB");
});

app.use(userRouter);
app.use(cardsRouter);
// если ни один из маршрутов не отвечает, то передаем ошибку 404
app.use((req, res, next) => {
  res.status(404).send({ message: "Ошибка 404 - Неправильный путь" });
  next();
});
// запуск сервера, слушаем порт
app.listen(PORT, () => {
  console.log("Run server...", PORT);
});
