const Router = require('express');
const router = new Router();
const authController = require('../controller/auth.controller.js');

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get('/refresh', authController.refreshToken);

module.exports = router;
