const express = require("express");
const User = require("Models/user");
const { encodeToken } = require("Config/njwt");
const UserJson = require("Views/user");

const router = express.Router();
const { responseFormatter, cryptPassword, comparePassword, formRequest } = require("Utilities/helpers");

const userCreateParams = ["email", "mobile", "firstName", "lastName", "password", "password_confirmation"];

// User Signup
router.post("/signup", (req, res) => {
  const request = formRequest(req.body, userCreateParams);

  const callback = () => {
    const data = new User(request);
    data.save({ overwrite: false }, (err, success) => {
      responseFormatter(res, err, UserJson(success));
    });
  };

  cryptPassword(request, res, callback);
});

// User Login
// This endpoints generates and returns a JWT access token given authentication data.
router.post("/login", (req, res) => {
  const request = req.body;

  const callback = (user, isPasswordMatch) => {
    if (isPasswordMatch) {
      const accessToken = encodeToken({ userEmail: user.email, userPassword: request.password });
      user.accessToken = accessToken;
      responseFormatter(res, null, UserJson(user));
    } else {
      res.status(401);
      responseFormatter(res, { message: "Invalid email or password" }, null);
    }
  };

  User.findOne({ email: request.email }, (err, user) => {
    if (err || !user) {
      res.status(401);
      res.send({ error: "Invalid email or password" });
    } else {
      comparePassword(request.password, user, (isPasswordMatch) => callback(user, isPasswordMatch));
    }
  });
});

module.exports = router;
