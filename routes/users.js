const express = require("express");
const users = express.Router();
const tokenModel = require("../model/token");
const userModel = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminAuthentication = require('../middlewares/adminAuthentication')

// create user account
users.post("/create", async (req, res, next) => {
  const { username, email, password, confirmpassword } = req.body;

  // check if password matches
  if (password != confirmpassword) {
    res.status(403);
    return res.send(`${password} not equal to  ${confirmpassword}`);
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // user object/debugging purpose
  const userObj = {
    userName: username,
    email: email,
    password: hashedPassword,
  };

  // create new user
  try {
    const newUserRecord = await userModel.create(userObj);
    if (!newUserRecord) {
      res.status(500);
      throw new Error("Internal server Error");
    }
    if (newUserRecord) {
      res.status(201);
      return res.redirect("/pages/login");
    }
  } catch (err) {
    next(err);
  }
});

// login users
users.post("/auth", async (req, res, next) => {
  const { email, password } = req.body;

  // find user records
  try {
    const userRecord = await userModel.findOne({ email: email });
    if (!userRecord) {
      res.status(404);
      req.flash("info", "Invalid user email");
      return res.redirect("/pages/login");
    }

    // validate user password
    if (userRecord) {
      const valid = await bcrypt.compare(password, userRecord.password);

      if (!valid) {
        res.status(404);
        req.flash("info", "Invalid user credentials");
        return res.redirect("/pages/login");
      }

      // generate jwt token
      const token = await jwt.sign(
        { role: userRecord.role, id: userRecord.id },
        process.env.ACCESS_TOKEN
      );
      if (!token) {
        res.status(500);
        throw new Error("Internal Server Error");
      }

      if (token) {
        // create cookie and session
        res.cookie("user", token, { maxAge: 15 * 60 * 100 });
        req.session.isAuth = true;
        return res.redirect("/pages/order");
      }
    }
  } catch (err) {
    next(err);
  }
});

// verify token
users.post("/token/verify", async (req, res, next) => {
  const { tokenData } = req.body;

  if ((tokenData.length = null)) {
    req.flash("info", "Please Enter Token");
    res.redirect("/pages/token");
  }

  // find token data
  try {
    const validToken = await tokenModel.findOne({ token: tokenData });
    if (!validToken) {
      req.flash("info", "Please Enter Valid Token");
      return res.redirect("/pages/token");
    }

    await jwt.sign(
      { role: validToken.role, id: validToken.id },
      process.env.ACCESS_TOKEN,
      { expiresIn: 5 * 60 * 1000 },
      (err, valid) => {
        if (err) {
          res.status(404);
          throw new Error("Internal Server Error");
        }
        if (valid) {
          res.cookie("signupToken", valid, { maxAge: 50 * 60 * 1000 });
          req.session.isAuth = true;
          res.redirect("/pages/signup");
        }
      }
    );
  } catch (err) {
    next(err);
  }
});

//get all user
users.post("/all",adminAuthentication("admin"), async (req, res, next) => {
  try {
    const allUsers = await userModel.find();
    if (allUsers == null) {
      res.status(404);
      req.flash("No Order Found");
      return res.redirect("/pages/dashboard");
    }

    res.json(allUsers);
  } catch (err) {
    next(err);
  }
});


// logout users
users.get("/users/logout", (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        req.flash("message", "Internal Error!");
        return res.redirect("/pages/login");
      }
      res.clearCookie("token"); // Clear the session cookie
      res.redirect("/pages/login"); // Redirect to the login page
    });
  } catch (err) {
    next(err);
  }
});

// delete users
users.post("/delete/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const userDeleted = await userModel.findByIdAndDelete(userId);
    res.json(userDeleted);
  } catch (err) {
    next(err);
  }
});

module.exports = users;
