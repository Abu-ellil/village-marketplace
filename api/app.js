const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// initialize DB connection (cached inside util)
connectDB().catch(err => console.error('DB connect error:', err));

const productsRouter = require('./routes/products');
const servicesRouter = require('./routes/services');
const ordersRouter = require('./routes/orders');

app.use('/api/products', productsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
