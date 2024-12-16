const mongoose = require('mongoose')
const tokenModel = new mongoose.Schema({
    token:{
        type:String,
        required:[true, "Token is required"]
    },
    role:{
        type:String,
        lowercase:true,
        required:[true, "Role Is Required"],
        default:"user"
    }},
    {timestamps:true,}
)

module.exports = mongoose.model("token", tokenModel)