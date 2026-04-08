const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');
const validateRequest = require('../middlewares/validateRequest');
const { movementSchema } = require('../validations/schemas');

router.get('/', movementController.getAll);
router.get('/:id', movementController.getById);
router.get('/product/:productId', movementController.getByProductId);
router.post('/', validateRequest(movementSchema), movementController.create);

module.exports = router;
