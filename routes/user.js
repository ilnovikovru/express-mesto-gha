const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { updateProfile, updateAvatar } = require('../controllers/user');

router.get('/users', (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка', error: err }));
});

router.get('/users/:userId', (req, res) => {
  User.findById(req.params.userId).select('name about avatar _id')
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка', error: err }));
});

router.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;
  const user = new User({ name, about, avatar });
  user.save()
    .then(newUser => res.status(201).send(newUser))
    .catch(err => res.status(400).send({ message: 'Произошла ошибка', error: err }));
});

router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
