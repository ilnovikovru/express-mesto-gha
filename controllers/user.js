const mongoose = require('mongoose');
const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

exports.getUserById = (req, res, next) => {
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
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  const user = new User({ name, about, avatar });
  user.save()
    .then((newUser) => res.status(201).send(newUser))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next({ status: 404, message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next({ status: 400, message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'CastError') {
        next({ status: 400, message: 'Передан некорректный идентификатор пользователя' });
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next({ status: 404, message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next({ status: 400, message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === 'CastError') {
        next({ status: 400, message: 'Передан некорректный идентификатор пользователя' });
      } else {
        next(err);
      }
    });
};
