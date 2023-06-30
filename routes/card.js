const express = require('express');
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const { validateObjId, validateCard } = require('../validators');

const router = express.Router();

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:id', validateObjId, deleteCard);
router.put('/cards/:id/likes', validateObjId, likeCard);
router.delete('/cards/:id/likes', validateObjId, dislikeCard);

module.exports = router;
