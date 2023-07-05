const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const NotFoundError = require('./errors/NotFoundError');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Произошла ошибка на сервере';
  res.status(statusCode).send({ message });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log('Слушаю порт 3000');
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(`Ошибка при подключении к базе данных: ${err}`);
  });
