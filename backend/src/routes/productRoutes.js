const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validateRequest = require('../middlewares/validateRequest');
const { productSchema, updateProductSchema } = require('../validations/schemas');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', validateRequest(productSchema), productController.create);
router.put('/:id', validateRequest(updateProductSchema), productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
