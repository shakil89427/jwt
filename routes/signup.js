// Required Packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

// Required fakedata
const fakeData = require("../fakedata/fakedata");

router.post("/signup", async (req, res) => {
  //  Run proper data validation. validation provided below is not enough
  if (!req?.body?.email || !req?.body?.password) {
    return res.status(400).send("Required fields missing");
  }

  // Find user on database
  const existUser = fakeData.find(
    (user) => user.email.toLowerCase() === req.body.email.toLowerCase()
  );

  // check user exist or not
  if (existUser) {
    return res.status(409).send("User already exist");
  }

  // make password encrypted
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  // replace user provided password with encryptedPassword
  const modifiedData = { ...req.body, password: encryptedPassword };

  //  Insert modifiedData to database. i am adding unique id manually. for actual database its not required
  fakeData.push({ ...modifiedData, id: randomUUID() });

  // Get data back from database for their provided unique id
  const responseData = fakeData.find(
    (user) => user.email.toLowerCase() === modifiedData.email.toLowerCase()
  );

  // create token
  const token = jwt.sign(
    { email: responseData.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: 900000,
    }
  );

  // set response cookie
  res.cookie(process.env.COOKIE_NAME, token, { maxAge: 900000 });

  // send response data
  res.send(responseData);
});

module.exports = router;
