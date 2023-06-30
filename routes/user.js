const express = require('express');
const { getUsers, getUserById, getUserInfo } = require('../controllers/user');

const router = express.Router();

const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

const validateObjId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

router.get('/users', getUsers);
router.get('/users/:id', validateObjId, getUserById);
router.get('/users/me', getUserInfo);

module.exports = router;
