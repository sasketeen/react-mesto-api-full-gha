const { Mongoose } = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');

const { JWT_SECRET } = require('../appConfig');

/** получение массива всех пользователей */
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

/** создание нового пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send(newUser);
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictingRequest('Такой пользователь уже существует'));
        return;
      }
      next(err);
    });
};

/** авторизация */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

/** получение текущего пользователя */
module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User
    .findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
        return;
      }
      next(new NotFound('Пользователь по указанному id не найден'));
    })
    .catch((err) => next(err));
};

/** получение пользователя по id */
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) throw new NotFound('Данные по указанному id не найдены');
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.CastError) next(new BadRequest('Неверные параметры запроса'));
      next(err);
    });
};

/**  обновление информации о пользователе */
module.exports.editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

/**  обновление аватара */
module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};
