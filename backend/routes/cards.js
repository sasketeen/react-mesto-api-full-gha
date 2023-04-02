const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, postCard, doesCardExist, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().uri(({ scheme: ['http', 'https'] })),
  }),
}), postCard);

router.use('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
}), doesCardExist);

router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
