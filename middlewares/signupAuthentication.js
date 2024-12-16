const jwt = require('jsonwebtoken')

const signupAuthentication = (role) => {
return async(req, res, next) => {
    // get token containing user details
    const token = req.cookies.signupToken
    console.log(token)
    if(!token){
        res.status(404)
        req.flash("info", "signup Token Not found!")
        return res.redirect("/token")
    }

    // verify token
    const userData = await jwt.verify(token, process.env.ACCESS_TOKEN)
    if(userData.role != role){
        res.status(404)
        req.flash("info", "Invalid user credentials!")
        return res.redirect("/token")
    }
    next()
}
}   



module.exports = signupAuthentication

