const express = require("express");
const admin = express.Router();
const tokenModel = require("../model/token")
const adminModel = require("../model/admin")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const adminAuthentication = require('../middlewares/adminAuthentication')

// authentication
admin.post("/auth", async (req, res, next) => {
  const { email, password } = req.body;
  // find admin records
  try {
    const userRecord = await adminModel.findOne({ email: email });
    if (!userRecord) {
      res.status(404);
      req.flash("info", "NO User Records Found!");
      return res.redirect("/pages/admin");
    }

    // validate user password
    if (userRecord) {
      const valid = await bcrypt.compare(password, userRecord.password);

      if (!valid) {
        res.status(404);
        req.flash("info", "Invalid user Credentials");
        return res.redirect("/pages/admin");
      }

      // generate jwt token
      const token = await jwt.sign(
        { role: userRecord.role, id: userRecord.id },
        process.env.ACCESS_TOKEN
      );
      if (!token) {
        throw new Error("Internal server Error");
      }

      if (token) {
        // create cookie and session
        res.cookie("topSecret", token, { maxAge: 20 * 60 * 100 });
        req.session.isAuth = true;
        return res.redirect("/pages/dashboard");
      }
    }
  } catch (err) {
    next(err);
  }
});

// create admin
admin.post("/create", (req, res, next) => {
  try {
    throw new Error("Not Allowed! ");
  } catch (err) {
    next(err);
  }
});

// generate access token
admin.post("/token/generate",adminAuthentication("admin"), async (req, res, next) => {
  try {
    // generating token
    const accessToken = crypto.randomBytes(4).toString("hex");

    // create token data
    const newToken = await tokenModel.create({ token: accessToken });
    if (!newToken) {
      res.status(500);
      throw new Error("You Can't create new Access token!");
    }
    res.redirect("/pages/dashboard");
  } catch (err) {
    next(err);
  }
});

// get all tokens
admin.post("/token/all",adminAuthentication("admin"), async (req, res) => {
  try {
    const tokenRecord = await tokenModel.find();
    if (!tokenRecord) {
      res.status(404);
      req.flash("info", "No Token Record Found!");
      return res.redirect("/dashboard");
    }

    res.json(tokenRecord);
  } catch (err) {
    next(err);
  }
});

// logout admin
admin.get('/logout',adminAuthentication("admin"), (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/pages/login")
      }
      res.clearCookie('topSecret'); // Clear the session cookie
      res.redirect('/pages/login'); // Redirect to the login page
  });
  } catch (err) {
    next(err)
  }
})



module.exports = admin;
