const path = require('path')
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const viewRouter = require('./routes/viewRoutes')

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

// 1) MIDDLEWARES
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this ip, Please try again in an hour'
})
app.use('/api', limiter);

app.use(express.json({limit: '10kb' }));
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies)
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message: `cant find ${req.originalUrl} on this server`
  // })
  // const err = new Error(`cant find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500
//   err.status = err.status || 'error'
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   })
// })

app.use(globalErrorHandler)

module.exports = app;