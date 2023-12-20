const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const productController = require('../controllers/productController');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/products', authenticateToken, upload.array('imagem', 4), productController.addProduct);
router.get('/products/:id', authenticateToken, productController.getProduct);

module.exports = router;
