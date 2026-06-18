const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/frames', require('./routes/frames'));
app.use('/api/lens-brands', require('./routes/lensBrands'));
app.use('/api/lens-types', require('./routes/lensTypes'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
