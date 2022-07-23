// Required Packages
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  // Check bith access and refresh tokens exist in cookie
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    return res.status(401).send("Authentication error");
  }

  const checkRefreshToken = () => {
    try {
      // Verify refreshToken from cookie
      const { email } = jwt.verify(
        req.cookies.refreshToken,
        process.env.JWT_SECRET_KEY
      );

      // Generate new accessToken
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5m",
      });

      // Add user email in req object for next use
      req.email = email;

      // Set response cookie
      res.cookie(process.env.COOKIE_NAME, token, { maxAge: 300000 });

      // Proceed to actual step
      next();
    } catch (err) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(401).send("Authentication error");
    }
  };

  const checkAccessToken = () => {
    try {
      // Verify accessToken from cookie
      const { email } = jwt.verify(
        req.cookies.accessToken,
        process.env.JWT_SECRET_KEY
      );

      // Add user email in req object for next use
      req.email = email;

      // Proceed to actual step
      next();
    } catch (err) {
      checkRefreshToken();
    }
  };
  checkAccessToken();
};

module.exports = checkAuth;
