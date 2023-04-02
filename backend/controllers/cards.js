const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

/** получение карточек */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => next(new InternalServerError()));
};

/** создание карточки */
module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(new InternalServerError());
    });
};

/** middleware проверки существования карточки */
module.exports.doesCardExist = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        // https://qna.habr.com/q/1153588
        req.locals = {
          card,
        };
        next();
        return;
      }
      next(new NotFound('Карточка с указанным id не найдена'));
    })
    .catch(() => next(new InternalServerError()));
};

/** удаление карточки */
module.exports.deleteCard = (req, res, next) => {
  const { card } = req.locals;
  if (`${card.owner}` !== req.user._id) {
    next(new Forbidden());
    return;
  }
  card
    .deleteOne()
    .then(() => res.send({ data: card }))
    .catch(() => next(new InternalServerError()));
};

// TODO переписать контролеры с использованием req.locals

/** добавления лайка карточке */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => next(new InternalServerError()));
};

/** удаления лайка у карточки */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch(() => next(new InternalServerError()));
};
