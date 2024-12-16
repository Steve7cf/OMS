const express = require('express')
const pages = express.Router()
const userAuthentication = require('../middlewares/userAuthentication')
const adminAuthentication = require('../middlewares/adminAuthentication')
const signupAuthentication = require('../middlewares/signupAuthentication')

// login page
pages.get("/login", (req, res) => {
  const message = req.flash("info")
  res.render("login", {error:message})
})

// signup page
pages.get("/signup",signupAuthentication("user"),  (req, res) => {
    const message = req.flash("info")
    res.render("signup", {error:message})
  })

// admin login
pages.get("/admin", (req, res) => {
    const message = req.flash("info")
    res.render("admin", {error:message})
  })

// dashboard
pages.get("/dashboard",adminAuthentication("admin"), (req, res) => {
    const message = req.flash("info")
    res.render("dashboard", {error:message})
  })

// order
pages.get("/order",adminAuthentication("admin"), (req, res) => {
    res.render("order")
  })

// token
pages.get("/token", (req, res) => {
    const message = req.flash("info")
    res.render("token", {error:message})
  })

// admin login
pages.get("/admin", (req, res) => {
    const message = req.flash("info")
    res.render("admin", {error:message})
  })

module.exports = pages