const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const validateRequest = require('../middlewares/validateRequest');
const { supplierSchema, updateSupplierSchema } = require('../validations/schemas');

router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', validateRequest(supplierSchema), supplierController.create);
router.put('/:id', validateRequest(updateSupplierSchema), supplierController.update);
router.delete('/:id', supplierController.delete);

module.exports = router;
