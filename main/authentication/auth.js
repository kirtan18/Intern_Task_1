const jwt = require('jsonwebtoken');

const TOKEN_KEY = 'secretkey';

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ msg: 'A token is required for authentication' });

  try {
    jwt.verify(token, TOKEN_KEY);
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid Token' });
  }
  return next();
};

module.exports = verifyToken;
