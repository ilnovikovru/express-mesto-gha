const { check, validationResult, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const UnauthorizedError = require('../errors/UnauthorizedError');

const JWT_SECRET = 'secret-key';

exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

exports.getUserById = [
  param('id').isMongoId().withMessage('Некорректный id пользователя'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    return User.findById(id).select('name about avatar _id')
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'Пользователь не найден',
          });
        }
        return res.status(200).send(user);
      })
      .catch(next);
  },
];

exports.createUser = [
  check('email').isEmail().withMessage('Укажите правильный адрес электронной почты'),
  check('password').isLength({ min: 8 }).withMessage('Пароль должен быть от 8 символов'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, about, avatar, email, password,
    } = req.body;

    return bcrypt.hash(password, 10)
      .then((hash) => {
        const user = new User({
          name, about, avatar, email, password: hash,
        });
        return user.save();
      })
      .then((newUser) => res.status(201).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      }))
      .catch((err) => next(err));
  },
];

exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

exports.login = [
  check('email').isEmail().withMessage('Некорректный формат почты'),
  check('password').isLength({ min: 8 }).withMessage('Пароль должен быть длиной не менее 8 символов'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    return User.findOne({ email }).select('+password')
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new UnauthorizedError('Неправильные почта или пароль');
            }

            return user;
          });
      })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).send({ token });
      })
      .catch((err) => {
        next(err);
      });
  },
];

exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateProfile = [
  check('name').isLength({ min: 2, max: 30 }).withMessage('Имя должно быть от 2 до 30 символов'),
  check('about').isLength({ min: 2, max: 30 }).withMessage('Должно быть от 2 до 30 символов'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, about } = req.body;

    return User.findByIdAndUpdate(
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
          return next({ status: 400, message: 'Переданы некорректные данные при обновлении профиля' });
        }
        if (err.name === 'CastError') {
          return next({ status: 400, message: 'Передан некорректный идентификатор пользователя' });
        }
        return next(err);
      });
  },
];

const urlRegex = /^(https?:\/\/)(www\.)?([\w-]+)\.([\w-]+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

module.exports.updateAvatar = [
  check('avatar').matches(urlRegex).withMessage('Введен неверный адрес аватара'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { avatar } = req.body;

    return User.findByIdAndUpdate(
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
          return next({ status: 400, message: 'Переданы некорректные данные при обновлении аватара' });
        }
        if (err.name === 'CastError') {
          return next({ status: 400, message: 'Передан некорректный идентификатор пользователя' });
        }
        return next(err);
      });
  },
];
