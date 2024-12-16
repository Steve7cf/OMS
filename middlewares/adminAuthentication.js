const jwt = require('jsonwebtoken')

const adminAuthentication = (role) => {
return async(req, res, next) => {
    // get token containing user details
    const token = req.cookies.topSecret
    if(!token){
        res.status(404)
        req.flash("info", "Invalid user credentials!")
        return res.redirect("/login")
    }

    // verify token
    const userData = await jwt.verify(token, process.env.ACCESS_TOKEN)
    if(userData.role != role){
        res.status(404)
        req.flash("info", "Invalid user credentials!")
        return res.redirect("/login")
    }

    req.user = userData
    next()
}
}   



module.exports = adminAuthentication

