const RoleService = require('../service/role-service.js');
const ApiError = require('../exceptions/api-error');

class RoleController {
  async getRoles(req, res, next) {
    try {
      const roles = await RoleService.getRoles();
      res.status(200).json(roles);
    } catch (e) {
      next(e);
    }
  }

  async giveRole(req, res, next) {
    try {
      const { role, users } = req.body;
      const updRoles = await RoleService.giveRole(role, users);
      res.status(200).json(updRoles);
    } catch (e) {
      next(e);
    }
  }

  async removeRole(req, res, next) {
    try {
      const { users } = req.body;
      const updRoles = await RoleService.removeRole(users);
      res.status(200).json(updRoles);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RoleController();
