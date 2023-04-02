const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // проверяем заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  // проверяем токен
  try {
    payload = jwt.verify(token, '0828c9036904226796ec7b3d4bfd79eafe5e285841b3a080b5380d808490be0a');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  // все хорошо идем дальше
  req.user = payload;
  next();
};
