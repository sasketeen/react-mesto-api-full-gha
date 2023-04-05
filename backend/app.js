require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const process = require('process');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { handleErrors } = require('./middlewares/handleErrors');
const router = require('./routes/index');

// переданное значение порта (по дефолту 3000)
const { PORT = 3000, LOCALHOST = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(LOCALHOST);

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(cors());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`Порт ${PORT}`);
});
