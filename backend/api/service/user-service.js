const db = require('../db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const tokenService = require('../service/token-service');
const UserDTO = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const SelectUsersDTO = require('../dtos/selectUsers-dto');

class UserService {
  async createUser({ name, surname, patronimyc, phone, email, login, password, team }) {
    const checkPhone = await db.query(`SELECT * FROM users WHERE phone = $1`, [phone]);
    if (checkPhone.rows[0]) {
      throw ApiError.BadRequest('Пользователь с таким номером телефона уже зарегистрирован!');
    }
    const checkEmail = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (checkEmail.rows[0]) {
      throw ApiError.BadRequest('Пользователь с такой почтой уже зарегистрирован!');
    }
    const checkLogin = await db.query(`SELECT * FROM accounts WHERE login = $1`, [login]);
    if (checkLogin.rows[0]) {
      throw ApiError.BadRequest('Пользователь с таким логином уже зарегистрирован!');
    }
    const newUser = await db.query(
      `INSERT INTO users(name, surname, patronimyc, phone, email, team) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, surname, patronimyc, phone, email, team],
    );
    const hashPassword = await bcrypt.hash(password, 3);
    const newAccount = await db.query(
      `INSERT INTO accounts(login, password, id_user) VALUES ($1, $2, $3) RETURNING *`,
      [login, hashPassword, newUser.rows[0].id_user],
    );
    const role = await db.query(`SELECT * FROM roles WHERE id_role = $1`, [
      newAccount.rows[0].role_id,
    ]);
    const userDto = new UserDTO({ ...newAccount.rows[0], ...role.rows[0], ...newUser.rows[0] });
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(newAccount.rows[0].id_account, tokens.refreshToken);
    return { user: { ...userDto }, ...tokens };
  }

  async getOneUser(id) {
    const user = await db.query(`SELECT * FROM users WHERE id_user = $1`, [id]);
    if (!user.rows[0]) {
      throw ApiError.BadRequest('Пользователь не найден!');
    }
    delete user.rows[0].id_user;
    return user;
  }

  async getUsers(offset, limit) {
    const users = await db.query(
      'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user LEFT JOIN roles ON accounts.role_id=roles.id_role',
    );
    const usersArr = users.rows.map((item) => {
      const user = new UserDTO(item);
      return { ...user };
    });
    const count = users.rows.length;
    const usersPage = usersArr.slice(offset, offset + limit);

    return { count: count, rows: [...usersPage] };
  }

  async searchUsers(search, group, offset, limit) {
    let users;
    const groupTerms = group.split(' '); // Разделяем строку по пробелам
    const groupQuery = groupTerms.map((term) => `%${term.toLowerCase()}%`); // Преобразуем каждый термин поиска в lowercase
    const searchTerms = search.split(' '); // Разделяем строку по пробелам
    const searchQuery = searchTerms.map((term) => `%${term.toLowerCase()}%`); // Преобразуем каждый термин поиска в lowercase
    if (group !== '' && search !== '') {
      users = await db.query(
        'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user LEFT JOIN roles ON accounts.role_id=roles.id_role WHERE  (LOWER(name) LIKE ANY ($1) OR LOWER(surname) LIKE ANY ($1) OR LOWER(patronimyc) LIKE ANY ($1)) AND ( LOWER(team) LIKE ANY ($2))',
        [searchQuery, groupQuery],
      );
    } else if (search || group) {
      if (search) {
        users = await db.query(
          'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user LEFT JOIN roles ON accounts.role_id=roles.id_role WHERE LOWER(name) LIKE ANY ($1) OR LOWER(surname) LIKE ANY ($1) OR LOWER(patronimyc) LIKE ANY ($1)',
          [searchQuery],
        );
      } else {
        users = await db.query(
          'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user LEFT JOIN roles ON accounts.role_id=roles.id_role WHERE  LOWER(team) LIKE ANY ($1)',
          [groupQuery],
        );
      }
    } else {
      users = await db.query(
        'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user LEFT JOIN roles ON accounts.role_id=roles.id_role',
      );
    }

    const usersArr = users.rows.map((item) => {
      const user = new UserDTO(item);
      return { ...user };
    });

    const count = usersArr.length;
    const usersPage = usersArr.slice(offset, offset + limit);

    return { count, rows: [...usersPage] };
  }

  async getSelectUsers(req, res) {
    const users = await db.query(
      'SELECT * FROM users LEFT JOIN accounts ON accounts.id_user=users.id_user',
    );
    const usersArr = users.rows.map((item) => {
      const user = new SelectUsersDTO(item);
      return { ...user };
    });

    return usersArr;
  }

  async updateUser({ name, surname, patronimyc, phone, email, team }, id) {
    const user = await db.query(
      'UPDATE users SET name = $1, surname = $2, patronimyc = $3, phone = $4, email = $5, team = $6 WHERE id_user = $7 RETURNING *',
      [name, surname, patronimyc, phone, email, team, id],
    );
    const account = await db.query(
      'SELECT * FROM accounts LEFT JOIN roles ON accounts.role_id = roles.id_role WHERE id_user = $1',
      [user.rows[0].id_user],
    );
    const userData = new UserDTO({ ...user.rows[0], ...account.rows[0] });
    return userData;
  }

  async getUserPhoto(id) {
    const img = await db.query('SELECT img FROM users WHERE id_user = $1', [id]);
    return img.rows[0].img;
  }

  async updateUserPhoto(id, img) {
    const oldImg = await db.query(`SELECT img FROM users WHERE id_user = $1`, [id]);
    if (oldImg.rows[0].img !== 'avatar.jpg') {
      fs.unlink(path.resolve(__dirname, '..', 'static', oldImg.rows[0].img), (err) => {
        if (err) console.log(err);
        console.log('File was deleted');
      });
    }
    const user = await db.query('UPDATE users SET img = $1 WHERE id_user = $2 RETURNING *', [
      img,
      id,
    ]);
    return user.rows[0].img;
  }

  async deleteUserPhoto(id) {
    const userPhoto = await db.query(`SELECT img FROM users WHERE id_user = $1`, [id]);
    const photo = userPhoto.rows[0].img;
    fs.unlink(path.resolve(__dirname, '..', 'static', photo), (err) => {
      if (err) console.log(err);
      console.log('File was deleted');
    });

    const userDeletedPhoto = await db.query(
      `UPDATE users SET img = 'avatar.jpg'
    WHERE id_user = $1 RETURNING *`,
      [id],
    );
    return userDeletedPhoto.rows[0].img;
  }

  async deleteUser(id) {
    const delAccount = await db.query(`SELECT * FROM accounts WHERE id_user = $1`, [id]);
    const user = await db.query(`DELETE FROM users WHERE id_user = $1`, [id]);
    return new UserDTO({ ...delAccount.rows[0], ...user.rows[0] });
  }
}

module.exports = new UserService();
