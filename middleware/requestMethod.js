// pulled from https://cheatcode.co/tutorials/how-to-implement-secure-httponly-cookies-in-node-js-with-express#creating-secure-cookies

export default (req, res, next) => {
    // NOTE: Exclude TRACE and TRACK methods to avoid XST attacks.
    const allowedMethods = [
      "OPTIONS",
      "HEAD",
      "CONNECT",
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
    ];
  
    if (!allowedMethods.includes(req.method)) {
      res.status(405).send(`${req.method} not allowed.`);
    }
  
    next();
};