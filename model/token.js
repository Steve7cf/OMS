const mongoose = require('mongoose')
const tokenModel = new mongoose.Schema({
    token:{
        type:String,
        lowercase:true,
        required:[true, "Please Enter User Name"],
        unique:[true, "Name Already Taken"]
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