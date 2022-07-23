// Required Packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Required fakedata
const fakeData = require("../fakedata/fakedata");

router.post("/login", async (req, res) => {
  try {
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

    // create access token
    const accessToken = jwt.sign(
      { email: existUser.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );

    // create refresh token
    const refreshToken = jwt.sign(
      { email: existUser.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // set response cookie
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    // send response data
    res.send(existUser);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
