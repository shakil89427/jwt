/* Required Packages */
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

/* Required routes */
const test = require("./routes/test");
const signup = require("./routes/signup");
const login = require("./routes/login");
const logout = require("./routes/logout");
const users = require("./routes/users");

/* Middlewares */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

/* All Routes */
app.use(test);
app.use(signup);
app.use(login);
app.use(logout);
app.use(users);

/* Port listener */
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
