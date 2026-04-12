const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { loginSchema, registerUserSchema } = require('../validations/schemas');

router.post('/register', validateRequest(registerUserSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
