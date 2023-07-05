// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Произошла ошибка на сервере';
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
