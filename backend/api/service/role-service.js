const db = require('../db');
const UserDTO = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class RoleService {
  async getRoles(req, res) {
    const roles = await db.query(`SELECT role_name FROM roles`);
    const map = roles.rows.map((obj) => obj.role_name);
    return map;
  }

  async giveRole(role, users) {
    if (!role) {
      throw ApiError.BadRequest('Не введена роль!');
    }
    if (!Array.isArray(users)) {
      throw ApiError.BadRequest('users не является массивом!');
    }
    if (users.length === 0) {
      throw ApiError.BadRequest('Не введено ни одного игрока!');
    }
    const updUsers = [];
    const promises = users.map(async (user) => {
      const roleId = await db.query(`SELECT id_role FROM roles WHERE role_name=$1`, [role]);
      const updRole = await db.query(
        `UPDATE accounts SET role_id=$1 WHERE id_account=$2 RETURNING *`,
        [roleId.rows[0].id_role, user],
      );
      const updUser = await db.query(`SELECT * FROM users WHERE id_user=$1`, [
        updRole.rows[0].id_user,
      ]);
      const updAccount = await db.query(
        `SELECT * FROM accounts LEFT JOIN roles ON accounts.role_id = roles.id_role WHERE id_account=$1`,
        [updRole.rows[0].id_account],
      );
      updUsers.push(new UserDTO({ ...updAccount.rows[0], ...updUser.rows[0] }));
    });

    await Promise.all(promises);

    return updUsers;
  }

  async removeRole(users) {
    if (!Array.isArray(users)) {
      throw ApiError.BadRequest('users не является массивом!');
    }
    if (users.length === 0) {
      throw ApiError.BadRequest('Не введено ни одного игрока!');
    }

    const updUsers = [];
    const promises = users.map(async (user) => {
      const roleId = await db.query(`SELECT id_role FROM roles WHERE role_name=$1`, ['USER']);
      const updRole = await db.query(
        `UPDATE accounts SET role_id=$1 WHERE id_account=$2 RETURNING *`,
        [roleId.rows[0].id_role, user],
      );
      const updUser = await db.query(`SELECT * FROM users WHERE id_user=$1`, [
        updRole.rows[0].id_user,
      ]);
      const updAccount = await db.query(
        `SELECT * FROM accounts LEFT JOIN roles ON accounts.role_id = roles.id_role WHERE id_account=$1`,
        [updRole.rows[0].id_account],
      );
      updUsers.push(new UserDTO({ ...updAccount.rows[0], ...updUser.rows[0] }));
    });

    await Promise.all(promises);

    return updUsers;
  }
}

module.exports = new RoleService();
