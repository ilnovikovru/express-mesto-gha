const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');
const { updateProfile, updateAvatar } = require('../controllers/user');

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', error: err }));
});

router.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({ message: 'Некорректный id пользователя' });
  }

  return User.findById(userId).select('name about avatar _id')
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id пользователя' });
      }
      return res.status(500).send({ message: 'Произошла ошибка', error: err });
    });
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  const user = new User({ name, about, avatar });
  user.save()
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации', error: err });
      }
      return res.status(500).send({ message: 'Произошла ошибка', error: err });
    });
});

router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
