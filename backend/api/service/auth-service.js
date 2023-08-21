const db = require('../db');
const UserDTO = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const tokenService = require('./token-service');
const bcrypt = require('bcrypt');

class AuthService {
  async login(login, password) {
    const account = await db.query(`SELECT * FROM accounts WHERE login = $1`, [login]);
    if (!account.rows[0]) {
      throw ApiError.BadRequest('Пользователь с таким логином не найден!');
    }
    const isPassEquals = await bcrypt.compare(password, account.rows[0].password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль!');
    }
    const role = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
      account.rows[0].role_id,
    ]);
    const user = await db.query('SELECT * FROM users WHERE id_user = $1', [
      account.rows[0].id_user,
    ]);
    const userDto = new UserDTO({ ...account.rows[0], ...role.rows[0], ...user.rows[0] });
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id_account, tokens.refreshToken);
    return { ...tokens, user: { ...userDto } };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorisedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb || !userData.id_account) {
      throw ApiError.UnauthorisedError();
    }
    const account = await db.query(`SELECT * FROM accounts WHERE id_account = $1`, [
      userData.id_account,
    ]);
    const user = await db.query('SELECT * FROM users WHERE id_user = $1', [userData.id_user]);
    if (!user.rows[0]) {
      throw ApiError.BadRequest('Пользователь не найден!');
    }
    const userRole = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
      account.rows[0].role_id,
    ]);

    const userDto = new UserDTO({ ...account.rows[0], ...user.rows[0], ...userRole.rows[0] });

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id_account, tokens.refreshToken);
    return { ...tokens, user: { ...userDto } };
  }
}

module.exports = new AuthService();
