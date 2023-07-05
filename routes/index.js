const router = require('express').Router();
const userRoutes = require('./user');
const cardRoutes = require('./card');
const { login, createUser } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { signinValidation, signupValidation } = require('../validators');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
