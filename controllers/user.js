const User = require('../models/user');

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
