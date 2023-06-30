const express = require('express');
const { getUsers, getUserById, getUserInfo } = require('../controllers/user');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', getUserInfo);

module.exports = router;
