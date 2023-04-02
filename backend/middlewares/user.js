const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const User = require('../models/user');

/** проверка существования пользователя с id из req.prams */
module.exports.doesUserExist = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        next();
        return;
      }
      next(new NotFound('Пользователь по указанному id не найден'));
    })
    .catch(() => next(new BadRequest('Неверные параметры запроса')));
};
