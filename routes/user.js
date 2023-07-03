const express = require('express');
const {
  getUsers, getUserById, getUserInfo, updateUserInfo,
} = require('../controllers/user');
const { validateObjId, validateUserUpdate } = require('../validators');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', validateObjId, getUserById);

router.patch('/users/me', validateUserUpdate, updateUserInfo);

module.exports = router;
