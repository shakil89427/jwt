// Required Packages
const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logout success");
});

module.exports = router;
