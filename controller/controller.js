const userModel = require("../model/model");
const adminModel = require("../model/admin");
const orderModel = require("../model/order");
const tokenModel = require("../model/token");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const crypto = require('crypto')



// rendering pages
const index = (req, res) => {res.render("index")}
const login = (req, res) => {
  const message = req.flash("info")
  res.render("login", {error:message})
}
const signup = (req, res) => {
  const message = req.flash("info")
  res.render("signup", {error:message})
}
const token = (req, res) => {
  const message = req.flash("info")
  res.render("token", {error:message})
}
const order = (req, res) => {
  const message = req.flash("info")
  res.render("order", {error:message})
}
const adminPanel = (req, res) => {
  const message = req.flash("info")
  res.render("admin", {error:message})
}
const dashboard = (req, res) => {res.render("dashboard")}

// user login
const create= async (req, res, next) => {
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
        throw new Error("Internal server Error")
      }
      if(newUserRecord){
        res.status(201)
        return res.redirect('/login')
      }
  } catch (err) {
    next(err)
  }
}

// authenticate user/login logic
const auth = async (req, res, next) => {
  const{email, password} = req.body

  // find user records
  try {
      const userRecord = await userModel.findOne({email:email})
      if(!userRecord){
        res.status(404)
        req.flash("info", "Invalid user email")
        return res.redirect("/login")
      }

      // validate user password
      if(userRecord){
        const valid = await bcrypt.compare(password, userRecord.password)

        if(!valid){
          res.status(404)
          req.flash("info", "Invalid user credentials")
          return res.redirect("/login")
        }

        // generate jwt token
        const token = await jwt.sign({role:userRecord.role, id:userRecord.id}, process.env.ACCESS_TOKEN)
        if(!token){
          res.status(500)
          throw new Error("Internal Server Error")
        }

        if(token){
          // create cookie and session
          res.cookie('user', token , {maxAge:15*60*100})
          req.session.isAuth = true
          return res.redirect('/order')
        }
      }    
  } catch (err) {
    next(err)
  }
}


const deleteUser = (req, res) => {res.render("auth")}
const updateUser= (req, res) => {res.render("index")}

// admin logic
const authAdmin= async(req, res, next) => {
  const{email, password} = req.body
    // find admin records
    try {
      const userRecord = await adminModel.findOne({email:email})
      if(!userRecord){
        res.status(404)
        req.flash("info", "NO User Records Found!")
        return res.redirect("/login")
      }

      // validate user password
      if(userRecord){
        const valid = await bcrypt.compare(password, userRecord.password)

        if(!valid){
          res.status(404)
          req.flash("info", "Invalid user Credentials")
          return res.redirect("/admin")
        }

        // generate jwt token
        const token = await jwt.sign({role:userRecord.role, id:userRecord.id}, process.env.ACCESS_TOKEN)
        if(!token){
          throw new Error('Internal server Error')
        }

        if(token){
          // create cookie and session
          res.cookie('topSecret', token , {maxAge:20*60*100})
          req.session.isAuth = true
          return res.redirect('/dashboard')
        }
      }   
  } catch (err) {
    next(err)
  }
}



// create admin
const createAdmin = (req, res, next) => {
  try {
      throw new Error("Not Allowed! ")
  } catch (err) {
      next(err); 
  }
};

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
      throw new Error('Internal Server Error!')
    }

    res.send(newOrder)
  } catch (err) {
    next(err)
  }
}

// order page
const orderPage = (req, res) => {
  res.render('orderpage')
}


const deleteOrder = (req, res) => {res.render("auth")}
const updateOrder= (req, res) => {res.render("index")}

// token
const genToken = (req, res) => {}
const verifyToken = (req, res) => {}

// logout
const logoutUser = (req, res, next) => {
  try {
    req.session.destroy(err => {
      if (err) {
        req.flash("message", "Internal Error!")
        return res.redirect("/login")
      }
      res.clearCookie('token'); // Clear the session cookie
      res.redirect('/login'); // Redirect to the login page
  });
  } catch (err) {
    next(err)
  }
}

// logout admin
const logoutAdmin = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        throw new Error("Server Error!")
      }
      res.clearCookie('topSecret'); // Clear the session cookie
      res.redirect('/admin'); // Redirect to the login page
  });
  } catch (error) {
    next(err)
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
  adminPanel,
  createAdmin,
  orderPage
};
