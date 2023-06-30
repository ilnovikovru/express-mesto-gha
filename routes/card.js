const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');

const { celebrate, Joi } = require('celebrate');

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

router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);
router.delete('/cards/:id', validateObjId, deleteCard);
router.put('/cards/:id/likes', validateObjId, likeCard);
router.delete('/cards/:id/likes', validateObjId, dislikeCard);

module.exports = router;
