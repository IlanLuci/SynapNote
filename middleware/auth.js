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
  if (!req.cookies) {
    res.locals.isLoggedIn = false;
    return next();
  }

  const token = req.cookies.token;

  if (!token) {
    res.locals.isLoggedIn = false;
    return next();
  }
  
  try {
    let decoded = jwt.verify(token, Bun.env.JWT_KEY);

    req.user = decoded;
  } catch (err) {
    res.locals.isLoggedIn = false;
    return next();
  }
  
  return res.redirect('/dashboard');
};

const authstate = async (req, res, next) => {
  if (!req.cookies) {
    res.locals.isLoggedIn = false;
    next();
    return;
  }

  const token = req.cookies.token;

  if (!token) {
    res.locals.isLoggedIn = false;
    next();
    return;
  }

  try {
    let decoded = jwt.verify(token, Bun.env.JWT_KEY);

    req.user = decoded;
  } catch (err) {
    res.locals.isLoggedIn = false;
    next();
    return;
  }
  
  res.locals.isLoggedIn = true;
  next();
};

export { auth, noauth, authstate };