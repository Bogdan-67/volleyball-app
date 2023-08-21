const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (role) {
  return function (req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnauthorisedError());
      }

      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(ApiError.UnauthorisedError());
      }

      const userData = tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.UnauthorisedError());
      }

      console.log(userData);

      if (userData.role !== role && userData.role !== 'ADMIN') {
        return next(ApiError.BadRequest('Нет прав доступа'));
      }
      req.user = userData;
      next();
    } catch (e) {
      return next(ApiError.UnauthorisedError());
    }
  };
};
