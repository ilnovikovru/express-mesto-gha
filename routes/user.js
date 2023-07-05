const express = require('express');
const {
  getUsers, getUserById, getUserInfo, updateUserInfo, updateAvatar,
} = require('../controllers/user');
const { validateObjId, validateUserUpdate, validateAvatarUpdate } = require('../validators');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.patch('/users/me', validateUserUpdate, updateUserInfo);
router.patch('/users/me/avatar', validateAvatarUpdate, updateAvatar);
router.get('/users/:id', validateObjId, getUserById);

module.exports = router;
