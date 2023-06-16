const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648b880a5c484558d4dd1804'
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);

app.use((err, req, res, next) => {
  const { status = 500, message = 'Произошла ошибка' } = err;
  res.status(status).send({ message });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000, () => {
      console.log('Слушаю порт 3000');
    });
  })
  .catch((err) => {
    console.log(`Ошибка при подключении к базе данных: ${err}`);
  });