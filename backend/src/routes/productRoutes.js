const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateRequest = require('../middlewares/validateRequest');
const { verifyToken } = require('../middlewares/authMiddleware');
const { productSchema, updateProductSchema } = require('../validations/schemas');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', verifyToken, validateRequest(productSchema), productController.create);
router.put('/:id', verifyToken, validateRequest(updateProductSchema), productController.update);
router.delete('/:id', verifyToken, productController.delete);

module.exports = router;
