const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648b880a5c484558d4dd1804',
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { status = 500, message } = err;

  if (err.name === 'ValidationError') {
    res.status(400).send({ message: 'Некорректные данные' });
  } else if (status === 404) {
    res.status(404).send({ message: 'Ресурс не найден' });
  } else {
    res.status(status).send({ message: message || 'Произошла ошибка' });
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
