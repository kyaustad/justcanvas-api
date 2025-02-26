const express = require('express');

const router = express.Router();
const authController = require('../controllers/authController');

router.route('/login').post(authController.login);
router.get('/me', authController.checkAuth, authController.getMe);
module.exports = router;
