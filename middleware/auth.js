const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  if (!req.cookies) return res.status(403).send('A token is required for authentication.');

  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send('A token is required for authentication.');
  }
  try {
    let decoded = jwt.verify(token, Bun.env.JWT_KEY);

    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token.');
  }
  return next();
};

const noauth = async (req, res, next) => {
  if (!req.cookies) return next();

  const token = req.cookies.token;

  if (!token) {
    return next();
  }
  try {
    let decoded = jwt.verify(token, Bun.env.JWT_KEY);

    req.user = decoded;
  } catch (err) {
    return next();
  }
  
  return res.status(403).send('You cannot access this while logged into your account.');
};

export { auth, noauth };