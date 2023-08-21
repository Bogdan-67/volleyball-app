const db = require('../db');
const jwt = require('jsonwebtoken');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(accountId, refreshToken) {
    const tokenData = await db.query(`SELECT * FROM tokens WHERE account_id = $1`, [accountId]);
    if (tokenData.rows[0]) {
      const newToken = await db.query(
        `UPDATE tokens SET refresh_token = $1 WHERE account_id = $2 RETURNING *`,
        [refreshToken, accountId],
      );
      return newToken;
    }
    const token = await db.query(
      `INSERT INTO tokens(account_id, refresh_token) VALUES ($1, $2) RETURNING *`,
      [accountId, refreshToken],
    );
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await db.query(`DELETE FROM tokens WHERE refresh_token = $1`, [refreshToken]);
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await db.query(`SELECT * FROM tokens WHERE refresh_token = $1`, [
      refreshToken,
    ]);
    return tokenData;
  }
}

module.exports = new TokenService();
