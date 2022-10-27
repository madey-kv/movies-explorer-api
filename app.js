require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { NotFoundError } = require('./errors/NotFoundError');
const authRouter = require('./routes/index');

const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000, DATA_BASE, NODE_ENV } = process.env;

app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'https://xeniama-mov.students.nomoredomains.icu/',
    'http://xeniama-mov.students.nomoredomains.icu/',
  ],
}));

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use(authRouter);

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));


app.use((req, res, next) => {
  next(new NotFoundError('Указанный маршрут не найден'));
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`Works on port ${PORT}`);
});
