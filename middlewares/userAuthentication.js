const jwt = require('jsonwebtoken')

const userAuthentication = (role) => {
return async(req, res, next) => {
    // get token containing user details
    const token = req.cookies.user
    if(!token){
        res.status(404)
        req.flash("info", "Invalid user credentials!")
        return res.redirect("/pages/login")
    }

    // verify token
    const userData = await jwt.verify(token, process.env.ACCESS_TOKEN)
    if(userData.role != role){
        res.status(404)
        req.flash("info", "Invalid user credentials!")
        return res.redirect("/pages/login")
    }

    req.user = userData
    next()
}
}   



module.exports = userAuthentication

