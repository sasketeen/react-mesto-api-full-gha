const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');
const ConflictingRequest = require('../errors/ConflictingRequest');

// const Unauthorized = require('../errors/Unauthorized');

/** получение массива всех пользователей */
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new InternalServerError()));
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
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictingRequest('Такой пользователь уже существует'));
        return;
      }
      next(new InternalServerError());
    });
};

/** авторизация */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // После ревью сгенерировать новый ключ и перенести его в .ENV
      const token = jwt.sign({ _id: user._id }, '0828c9036904226796ec7b3d4bfd79eafe5e285841b3a080b5380d808490be0a', { expiresIn: '1d' });
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
        res.send({ user });
        return;
      }
      next(new NotFound('Пользователь по указанному id не найден'));
    })
    .catch(() => next(new InternalServerError()));
};

/** получение пользователя по id */
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => next(new InternalServerError()));
};

/**  обновление информации о пользователе */
module.exports.editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(new InternalServerError());
    });
};

/**  обновление аватара */
module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(new InternalServerError());
    });
};
