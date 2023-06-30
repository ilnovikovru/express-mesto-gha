const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const auth = require('./middlewares/auth');
const { signinValidation, signupValidation } = require('./validators');

const app = express();

app.use(express.json());

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { status = 500, message, code } = err;

  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Некорректные данные' });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Некорректный идентификатор' });
  } else if (code === 11000) {
    res.status(409).send({ message: 'Такой пользователь уже существует' });
  } else if (status === 404) {
    res.status(404).send({ message: 'Ресурс не найден' });
  } else {
    res.status(status).send({ message: message || 'Произошла ошибка на сервере' });
  }
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
