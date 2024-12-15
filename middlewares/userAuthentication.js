const jwt = require('jsonwebtoken')

const userAuthentication = (role) => {
return async(req, res, next) => {
    // get token containing user details
    const token = req.cookies.user
    if(!token){
        res.status(404)
        req.flash("info", "No User Token Found!")
        return res.redirect("/login")
    }

    // verify token
    const userData = await jwt.verify(token, process.env.ACCESS_TOKEN)
    if(userData.role != role){
        res.status(404)
        req.flash("info", "Login Please")
        return res.redirect("/login")
    }

    req.user = userData
    next()
}
}   



module.exports = userAuthentication

