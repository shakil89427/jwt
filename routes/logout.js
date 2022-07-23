// Required Packages
const express = require("express");
const router = express.Router();

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.send("Logout success");
});

module.exports = router;
