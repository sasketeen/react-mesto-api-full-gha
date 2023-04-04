const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/NotFound');

// переданное значение порта (по дефолту 3000)
const { PORT = 3000, LOCALHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(LOCALHOST);

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authRouter);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/*', (req, res, next) => {
  next(new NotFound('Как ты тут оказался?'));
});

app.use(errorLogger);

app.use(errors());

// https://expressjs.com/ru/guide/error-handling.html
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: `ошибка ${err.statusCode}: ${err.message}` });
  next();
});

app.listen(PORT, () => {
  console.log(`Порт ${PORT}`);
});
