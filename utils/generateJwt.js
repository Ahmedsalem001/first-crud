const jwt = require('jsonwebtoken');

const generateJwt = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
  return token;
}

module.exports = generateJwt