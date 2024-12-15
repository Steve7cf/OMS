const express = require('express')
const route = express.Router()
const rest = require('../controller/controller')

// get routes
route.get('/', rest.index)
route.get("/home", rest.home)
route.get("/login", rest.login)
route.get("/signup", rest.signup)
route.get("/logout", rest.logout)
route.get('/dashboard', rest.dashboard)
route.get('/order', rest.order)
route.get('/token', rest.token)

// post
route.post("/auth", rest.auth)
route.post("/create", rest.create)


module.exports = route