import AppError from './util/appError';
if (process.env.NODE_ENV !== 'production') require('dotenv-safe').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Require database configuration
const db = require('./config/db');

// Set App Variable
const app = express();

// Middleware
app.use(logger('common', { skip: () => process.env.NODE_ENV === 'test' }));
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/v1/products', require('./routes/products'));

/// //////////////////////////////////////////////////////////////////////////////////////
// If no explicit error and route requested not found
/// //////////////////////////////////////////////////////////////////////////////////////
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/// //////////////////////////////////////////////////////////////////////////////////////
// Error page for error handling
/// //////////////////////////////////////////////////////////////////////////////////////
app.use((error, req, res, next) =>
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    data: error.data || null,
  })
);

// Set db
const run = async () => {
  // Connect to Mongoose database. Connection code in config/db.js
  await db();
  await app.listen(process.env.PORT);
  console.log(`App listening on port ${process.env.PORT}!`);
};

run();

module.exports = app;
