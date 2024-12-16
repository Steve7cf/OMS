const express = require('express')
const route = express.Router()
const rest = require('../controller/controller')
const userAuthentication = require('../middlewares/userAuthentication')
const adminAuthentication = require('../middlewares/adminAuthentication')


// get routes
route.get('/', rest.index)
 
route.get('/order',userAuthentication("user"), rest.order)



// users routes
route.post("/auth", rest.auth)
route.post("/create", rest.create)
route.patch("/updateUser", rest.updateUser)
route.delete("/deleteUser", rest.deleteUser)
route.get("/signup", rest.signup)
route.get("/login", rest.login)
route.get("/admin", rest.adminPanel)

// admin routes
route.post("/authadmin", rest.authAdmin)
route.get('/dashboard',adminAuthentication("admin"), rest.dashboard)
route.post('/genToken',adminAuthentication("admin"), rest.genToken)

// order routes
route.post("/createOrder",userAuthentication("user"), rest.createOrder)
route.patch("/updateOrder",adminAuthentication("user"), rest.updateOrder)
route.delete("/deleteOrder",adminAuthentication("admin"), rest.deleteOrder)

// other routes
route.get('/token', rest.token)
route.get('/verifyToken', rest.token)
route.get('/genToken',adminAuthentication("admin"), rest.genToken)
route.get("/logoutUser",userAuthentication("user"), rest.logoutUser)
route.get("/logoutAdmin",adminAuthentication("admin"), rest.logoutAdmin)

module.exports = route