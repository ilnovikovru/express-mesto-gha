const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};
