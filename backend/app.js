const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/NotFound');

// переданное значение порта (по дефолту 3000)
const { PORT = 3000, LOCALHOST = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(LOCALHOST);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use('/', authRouter);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/*', (req, res, next) => {
  next(new NotFound('Как ты тут оказался?'));
});
app.use(errors());

// https://expressjs.com/ru/guide/error-handling.html
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: `ошибка ${err.statusCode}: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  console.log(`Порт ${PORT}`);
});
