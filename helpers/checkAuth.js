// Required Packages
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    // Verify token from cookie
    const { email } = jwt.verify(
      req.cookies[process.env.COOKIE_NAME],
      process.env.JWT_SECRET_KEY
    );

    // Generate new token
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: 900000,
    });

    // Set response cookie
    res.cookie(process.env.COOKIE_NAME, token, { maxAge: 900000 });

    // Add user email in req object for next use
    req.email = email;

    // Proceed to actual step
    next();
  } catch (err) {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(401).send("Authentication error");
  }
};

module.exports = checkAuth;
