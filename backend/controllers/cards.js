const { Mongoose } = require('mongoose');
const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

/** получение карточек */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .catch((err) => next(err));
};

/** создание карточки */
module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card
        .populate('owner')
        .then(() => res.status(201).send(card))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof Mongoose.Error.ValidationError) {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

/** удаление карточки */
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) throw new NotFound('Данные по указанному id не найдены');
      if (`${card.owner}` !== req.user._id) {
        next(new Forbidden('Доступ запрещен'));
      }
      card
        .deleteOne()
        .then(() => res.send({ data: card }))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

/** добавления лайка карточке */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) throw new NotFound('Данные по указанному id не найдены');
      res.send(card);
    })
    .catch((err) => next(err));
};

/** удаления лайка у карточки */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) throw new NotFound('Данные по указанному id не найдены');
      res.send(card);
    })
    .catch((err) => next(err));
};
