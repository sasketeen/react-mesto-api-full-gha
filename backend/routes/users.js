const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getMe, getUserInfo, getUsers, editUserInfo, editAvatar,
} = require('../controllers/users');
const { doesUserExist } = require('../middlewares/user');

router.get('/', getUsers);
router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), editUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .uri(({ scheme: ['http', 'https'] })),
  }),
}), editAvatar);

router.use('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), doesUserExist);

router.get('/:userId', getUserInfo);

module.exports = router;
