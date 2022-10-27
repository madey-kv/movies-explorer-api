const { celebrate, Joi } = require('celebrate');
const usersRouter = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');

usersRouter.get('/users/me', getUser);

usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = usersRouter;
