const UserService = require('../service/user-service.js');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');
const uuid = require('uuid');
const path = require('path');
const sharp = require('sharp');

class UserController {
  async createUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
      }

      // Проверка результата капчи
      if (!req.body['g-recaptcha-response']) {
        return next(ApiError.BadRequest('Необходимо пройти капчу'));
      }

      const createdUser = await UserService.createUser(req.body);
      res.cookie('refreshToken', createdUser.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.status(200).json(createdUser);
    } catch (e) {
      next(e);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const getUser = await UserService.getOneUser(req.params.id);
      res.status(200).json(getUser.rows[0]);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      let { page, limit } = req.query;
      page = +page || 1;
      limit = +limit || 8;
      let offset = page * limit - limit;
      const getUsers = await UserService.getUsers(offset, limit);

      res.status(200).json(getUsers);
    } catch (e) {
      next(e);
    }
  }
  async searchUsers(req, res, next) {
    try {
      let { search, group, page, limit } = req.query;
      page = +page || 1;
      limit = +limit || 8;
      let offset = page * limit - limit;
      const searchUsers = await UserService.searchUsers(search, group, offset, limit);

      res.status(200).json(searchUsers);
    } catch (e) {
      next(e);
    }
  }

  async getSelectUsers(req, res, next) {
    try {
      const getUsers = await UserService.getSelectUsers();
      res.status(200).json(getUsers);
    } catch (e) {
      next(e);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req.body, req.params.id);

      res.status(200).json(updatedUser);
    } catch (e) {
      next(e);
    }
  }

  async getUserPhoto(req, res, next) {
    try {
      const { id } = req.params;

      const userPhoto = await UserService.getUserPhoto(id);
      res.status(200).json(userPhoto.rows[0]);
    } catch (e) {
      next(e);
    }
  }

  async updateUserPhoto(req, res, next) {
    try {
      const { id } = req.body;
      const { img } = req.files;
      const maxSize = 10 * 1024 * 1024; // Максимальный размер файла в байтах (10 МБ)
      let fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static', fileName);

      if (img.size > maxSize) {
        // Изображение превышает максимальный размер, необходимо сжатие
        sharp(img.data)
          .resize({ width: 800, height: 600 }) // Установите необходимые размеры
          .toFile(filePath, (err, info) => {
            if (err) {
              console.error('Ошибка при сжатии изображения:', err);
              return res.status(500).json({ message: 'Ошибка при сжатии изображения.' });
            }
            console.log('Изображение успешно сжато:', info);
          });
      } else {
        // Изображение не превышает максимальный размер, сохраняем его без изменений
        img.mv(filePath, (err) => {
          if (err) {
            console.error('Ошибка при сохранении изображения:', err);
            return res.status(500).json({ message: 'Ошибка при сохранении изображения.' });
          }
          console.log('Изображение успешно сохранено');
        });
      }
      const userPhoto = await UserService.updateUserPhoto(id, fileName);
      res.status(200).json(userPhoto);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserPhoto(req, res, next) {
    try {
      const deletedUserPhoto = await UserService.deleteUserPhoto(req.params.id);
      res.status(200).json(deletedUserPhoto);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      res.status(200).json(deletedUser);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
