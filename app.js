const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const authCheck = require('./controllers/authCeck');
const officeRouter = require('./routers/officeRouter');
const pinRouter = require('./routers/pinRouter');
const areaRouter = require('./routers/areaRouter');

const app = express();

// MIDDLEWARE STACK
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

const allowedOrigins =
  process.env.NODE_ENV === 'development'
    ? '*'
    : new RegExp(/^https:\/\/([a-zA-Z0-9-]+)\.justcanvas\.app$/);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins === '*' || allowedOrigins.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors());

// ROUTING

app.use('/api/v1/areas', authCheck.protect, areaRouter);
app.use('/api/v1/users', authCheck.protect, userRouter);
app.use('/api/v1/offices', authCheck.protect, officeRouter);
app.use('/api/v1/pins', authCheck.protect, pinRouter);
app.use('/api/v1/auth', authRouter);

console.log(allowedOrigins);

module.exports = app;
