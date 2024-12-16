const express = require('express')
const route = express.Router()
const rest = require('../controller/controller')
const userAuthentication = require('../middlewares/userAuthentication')
const adminAuthentication = require('../middlewares/adminAuthentication')
const signupAuthentication = require('../middlewares/signupAuthentication')

// get routes
route.get('/', rest.index)
 
route.get('/order',userAuthentication("user"), rest.order)
route.get('/createAdmin', rest.createAdmin)


// users routes
route.post("/auth", rest.auth)
route.post("/create", rest.create)
route.patch("/updateUser", rest.updateUser)
route.delete("/deleteUser", rest.deleteUser)
route.get("/signup",signupAuthentication("user"), rest.signup)
route.get("/login", rest.login)
route.get("/admin", rest.adminPanel)

// admin routes
route.post("/authadmin", rest.authAdmin)
route.get('/dashboard',adminAuthentication("admin"), rest.dashboard)


// order routes
route.post("/createOrder",userAuthentication("user"), rest.createOrder)
route.patch("/updateOrder",adminAuthentication("user"), rest.updateOrder)
route.delete("/deleteOrder",adminAuthentication("admin"), rest.deleteOrder)
route.get('/orderPage', rest.orderPage)

// other routes
route.get('/token', rest.token) 
route.post('/verifyToken', rest.verifyToken)
route.post('/allToken', rest.allToken) //admin
route.post('/genToken', rest.genToken) //admin
route.get("/logoutUser",userAuthentication("user"), rest.logoutUser)
route.get("/logoutAdmin",adminAuthentication("admin"), rest.logoutAdmin)


module.exports = route