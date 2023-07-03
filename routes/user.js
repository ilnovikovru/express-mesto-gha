const express = require('express');
const { getUsers, getUserById, getUserInfo } = require('../controllers/user');
const { validateObjId } = require('../validators');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:id', validateObjId, getUserById);

module.exports = router;
