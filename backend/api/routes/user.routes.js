const Router = require('express');
const router = new Router();
const userController = require('../controller/user.controller');
const { body } = require('express-validator');
const checkRole = require('../middlewares/check-role-middleware');
const Recaptcha = require('express-recaptcha').RecaptchaV2;

// Создайте экземпляр Recaptcha, передавая секретный и публичный ключи
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

router.post(
  '/registration',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 4, max: 32 }),
    recaptcha.middleware.verify, // Добавьте middleware проверки капчи
  ],
  userController.createUser,
);
router.get('/users', checkRole('ADMIN'), userController.getUsers);
router.get('/user/:id', userController.getOneUser);
router.put('/user/:id', userController.updateUser);
router.get('/select-users', checkRole('EDITOR'), userController.getSelectUsers);
router.get('/photo/:id', userController.getUserPhoto);
router.get('/search-users', checkRole('EDITOR'), userController.searchUsers);
router.put('/photo', userController.updateUserPhoto);
router.delete('/photo/:id', userController.deleteUserPhoto);
router.delete('/user/:id', checkRole('ADMIN'), userController.deleteUser);

module.exports = router;
