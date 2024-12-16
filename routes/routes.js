const express = require('express')
const route = express.Router()
const rest = require('../controller/controller')
const userAuthentication = require('../middlewares/userAuthentication')
const adminAuthentication = require('../middlewares/adminAuthentication')
const signupAuthentication = require('../middlewares/signupAuthentication')

// get routes
route.get('/', rest.index)
 
route.get('/order',userAuthentication("user"), rest.order) //user
route.get('/createAdmin', rest.createAdmin)


// users routes
route.post("/auth", rest.auth)
route.post("/create", rest.create)
route.patch("/updateUser", rest.updateUser)
route.delete("/deleteUser", rest.deleteUser)
route.get("/login", rest.login)
route.get("/admin", rest.adminPanel)
route.post("/authadmin", rest.authAdmin)
route.get('/orderPage',userAuthentication("user"), rest.orderPage)

// user authentication
route.get("/logoutUser",userAuthentication("user"), rest.logoutUser) //user
route.get("/signup",signupAuthentication("user"), rest.signup) //user
route.post("/createOrder",userAuthentication("user"), rest.createOrder) //user
route.patch("/updateOrder",userAuthentication("user"), rest.updateOrder) //user


// admin authentication
route.get('/dashboard',adminAuthentication("admin"), rest.dashboard) //admin
route.delete("/deleteOrder",adminAuthentication("admin"), rest.deleteOrder) //admin
route.get("/logoutAdmin",adminAuthentication("admin"), rest.logoutAdmin) //admin 
route.post('/allToken',adminAuthentication("admin"), rest.allToken) //admin
route.post('/genToken',adminAuthentication("admin"), rest.genToken) //admin





// other routes
route.get('/token', rest.token) 
route.post('/verifyToken', rest.verifyToken)





module.exports = route