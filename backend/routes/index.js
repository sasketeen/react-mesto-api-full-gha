const router = require('express').Router();

const authRouter = require('./auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req, res, next) => {
  next(new NotFound('Как ты тут оказался?'));
});

module.exports = router;
