// Required Packages
const express = require("express");
const router = express.Router();
const checkAuth = require("../helpers/checkAuth");

// Required fakedata
const fakeData = require("../fakedata/fakedata");

router.get("/users", checkAuth, async (req, res) => {
  // get data from database
  const allData = fakeData;

  // send response data
  res.send({ data: allData, authorizedUserEmail: req.email });
});

module.exports = router;
