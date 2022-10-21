const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/me', getUser);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = usersRouter;
