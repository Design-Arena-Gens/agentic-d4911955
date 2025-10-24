const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const paymentController = require('./controllers/paymentController');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

const allowedOrigins = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : ['http://localhost:3000'];

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
