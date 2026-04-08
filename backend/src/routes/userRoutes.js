const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateRequest = require('../middlewares/validateRequest');
const { registerUserSchema, updateUserSchema } = require('../validations/schemas');

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', validateRequest(registerUserSchema), userController.create);
router.put('/:id', validateRequest(updateUserSchema), userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
