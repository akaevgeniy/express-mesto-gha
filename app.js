const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const auth = require("./middlewares/auth");
const userRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const errors = require("./middlewares/errors");
const {
  createUser,
  login
} = require("./controllers/users");

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.post("/signup", createUser);

app.post("/signin", login);

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
app.use(errors);
// запуск сервера, слушаем порт
app.listen(PORT, () => {
  console.log("Run server...", PORT);
});
