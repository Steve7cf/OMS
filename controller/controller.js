const userModel = require("../model/model");
const adminModel = require("../model/admin");
const orderModel = require("../model/order");
const tokenModel = require("../model/token");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')


// rendering pages
const index = (req, res) => {res.render("index")}
const login = (req, res) => {res.render("login")}
const signup = (req, res) => {res.render("signup")}
const token = (req, res) => {res.render("token")}
const order = (req, res) => {res.render("order")}
const dashboard = (req, res) => {res.render("dashboard")}

// user login
const create= async (req, res) => {
  const{username,email, password, confirmpassword} = req.body

  // check if password matches
  if(password != confirmpassword){
    res.status(403)
    return res.send(`${password} not equal to  ${confirmpassword}`)
  }

  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // user object/debugging purpose
  const userObj = {userName:username,email:email, password:hashedPassword}

  // create new user
  try {
      const newUserRecord = await userModel.create(userObj)
      if(!newUserRecord){
        res.status(500)
        return res.send("Whoops! can't create user")
      }
      if(newUserRecord){
        res.status(201)
        return res.redirect('/login')
      }
  } catch (err) {
    console.log(err.message)
  }
}

// authenticate user/login logic
const auth = async (req, res) => {
  const{email, password} = req.body

  // find user records
  try {
      const userRecord = await userModel.findOne({email:email})
      if(!userRecord){
        res.send("no user record")
        res.status(404)
      }

      // validate user password
      if(userRecord){
        const valid = await bcrypt.compare(password, userRecord.password)

        if(!valid){
          res.status(403)
          return res.send("Invalid User Password")
        }

        // generate jwt token
        const token = await jwt.sign({role:userRecord.role, id:userRecord.id}, process.env.ACCESS_TOKEN)
        if(!token){
          res.status(500)
          return res.send("Jwt: cant sign in")
        }

        if(token){
          // create cookie and session
          res.cookie('user', token , {maxAge:15*60*100})
          req.session.isAuth = true
          return res.redirect('/order')
        }
      }

      
      
  } catch (err) {
    console.log(err.message)
  }
}


const deleteUser = (req, res) => {res.render("auth")}
const updateUser= (req, res) => {res.render("index")}

// admin logic
const authAdmin= async(req, res) => {
  const{email, password} = req.body
    // find admin records
    try {
      const userRecord = await adminModel.findOne({email:email})
      if(!userRecord){
        res.send("no user record")
        res.status(404)
      }

      // validate user password
      if(userRecord){
        const valid = await bcrypt.compare(password, userRecord.password)

        if(!valid){
          res.status(403)
          return res.send("Invalid User Password")
        }

        // generate jwt token
        const token = await jwt.sign({role:userRecord.role, id:userRecord.id}, process.env.ACCESS_TOKEN)
        if(!token){
          res.status(500)
          return res.send("Jwt: cant sign in")
        }

        if(token){
          // create cookie and session
          res.cookie('topSecret', token , {maxAge:20*60*100})
          req.session.isAuth = true
          return res.redirect('/dashboard')
        }
      }

      
      
  } catch (err) {
    console.log(err.message)
  }
}

// const createAdmin= (req, res) => {
//   res.status(403)
//   return res.send("You Can't access This route")
// }

const createAdmin= async (req, res) => {
  const{username,email, password} = req.body



  // hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // user object/debugging purpose
  const userObj = {userName:username,email:email, password:hashedPassword}

  // create new user
  try {
      const newUserRecord = await adminModel.create(userObj)
      if(!newUserRecord){
        res.status(500)
        return res.send("Whoops! can't new Admin")
      }
      if(newUserRecord){
        res.status(201)
        return res.redirect('/login')
      }
  } catch (err) {
    console.log(err.message)
  }
}

const adminPanel = (req, res) => {
  res.render("admin")
}

// order logic
const createOrder = async(req, res) => {
  const{customername, productname, quantity, contact, address, region, zip, payment, cardholder, cardnumber, expiredate, cvv, price} = req.body

  // create orde token
  const orderid = crypto.randomBytes(5).toString('hex',0,9).toUpperCase()

  // order object
  const orderObject = {
    orderId:orderid,
    customername:customername,
    productname:productname,
    quantity:quantity,
    contact:contact,
    address:address,
    region:region,
    zip:zip,
    paymentmethod:payment,
    creditcardholder:cardholder,
    cardnumber:cardnumber,
    expirationdate:expiredate,
    cvv:cvv,
    price:price,
    status:"pending",
  }

  // create order
  try {
    const newOrder = await orderModel.create(orderObject)
    if(!newOrder){
      res.status(500)
      return res.send("Whoops! can't create user")
    }

    res.send(newOrder)
  } catch (err) {
    console.log(err.message)
  }
}
const deleteOrder = (req, res) => {res.render("auth")}
const updateOrder= (req, res) => {res.render("index")}

// token
const genToken = (req, res) => {}
const verifyToken = (req, res) => {}

// logout
const logoutUser = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/login")
      }
      res.clearCookie('token'); // Clear the session cookie
      res.redirect('/login'); // Redirect to the login page
  });
  } catch (error) {
    req.flash("message", `${err.message}`)
    res.redirect("/")
  }
}

// logout admin
const logoutAdmin = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/login")
      }
      res.clearCookie('topSecret'); // Clear the session cookie
      res.redirect('/admin'); // Redirect to the login page
  });
  } catch (error) {
    req.flash("message", `${err.message}`)
    res.redirect("/")
  }
}

// export modules
module.exports = {
  index,
  order,
  auth,
  create,
  updateUser,
  deleteUser,
  signup,
  login,
  createAdmin,
  updateOrder,
  deleteOrder,
  createOrder,
  token,
  verifyToken,
  logoutUser,
  logoutAdmin,
  genToken,
  dashboard,
  authAdmin,
  adminPanel
};
