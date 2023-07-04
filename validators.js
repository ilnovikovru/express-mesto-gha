const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

const validateObjId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      const urlPattern = new RegExp(/^(https?:\/\/)(www\.)?([\w-]+)\.([\w-]+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/);
      if (!urlPattern.test(value)) {
        return helpers.message('Некорректный URL');
      }
      return value;
    }),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).allow(''),
    about: Joi.string().min(2).max(30).allow(''),
    avatar: Joi.string().uri().allow('').custom((value, helpers) => {
      const urlPattern = new RegExp(/^(https?:\/\/)(www\.)?([\w-]+)\.([\w-]+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/);
      if (!urlPattern.test(value) && value !== '') {
        return helpers.message('Некорректный URL');
      }
      return value;
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required().custom((value, helpers) => {
      const urlPattern = new RegExp(/^(https?:\/\/)(www\.)?([\w-]+)\.([\w-]+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/);
      if (!urlPattern.test(value)) {
        return helpers.message('Некорректный URL');
      }
      return value;
    }),
  }),
});

module.exports = {
  validateObjId,
  validateCard,
  signinValidation,
  signupValidation,
  validateUserUpdate,
  validateAvatarUpdate,
};
