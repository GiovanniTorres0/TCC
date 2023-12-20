// ./routes/paymentRoutes.js
const express = require('express');
const { createPayment } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create_payment', createPayment);

module.exports = router;
