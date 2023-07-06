const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const auth = require('./middlewares/auth');
const { signinValidation, signupValidation } = require('./validators');

const NotFoundError = require('./errors/NotFoundError');

const app = express();

app.use(express.json());

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Произошла ошибка' : err.message;
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
