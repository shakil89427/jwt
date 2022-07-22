// Required Packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Required fakedata
const fakeData = require("../fakedata/fakedata");

router.post("/login", async (req, res) => {
  // Check data validation
  if (!req?.body?.email || !req?.body?.password) {
    return res.status(400).send("Required fields missing");
  }

  //  Get userdata from database
  const existUser = fakeData.find(
    (user) => user.email.toLowerCase() === req.body.email.toLowerCase()
  );

  // Check user exist or not
  if (!existUser) {
    return res.status(401).send("Authentication Error");
  }

  // Check user provided password with database stored password
  const valid = await bcrypt.compare(req.body.password, existUser.password);
  if (!valid) {
    return res.status(401).send("Authentication Error");
  }

  // create token
  const token = jwt.sign(
    { email: existUser.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: 900000,
    }
  );

  // set response cookie
  res.cookie(process.env.COOKIE_NAME, token, { maxAge: 900000 });

  // send response data
  res.send(existUser);
});

module.exports = router;
