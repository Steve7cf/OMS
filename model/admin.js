const mongoose = require('mongoose')
const adminModel = new mongoose.Schema({
    username:{
        type:String,
        lowercase:true,
        required:[true, "Please Enter User Name"],
        unique:[true, "Name Already Taken"]
    },
    email:{
        type:String,
        lowercase:true,
        required:[true, "Please Enter Email"],
        unique:[true, "Email Already Taken"]
    },
    password:{
        type:String,
        required:[true, "Please Enter Password"],
        unique:[true, "Name Already Taken"],
        minlength:[6, "Password too short"]
    },
    role:{
        type:String,
        lowercase:true,
        required:[true, "Role Is Required"],
        default:"admin"
    }},
    {timestamps:true,}
)

module.exports = mongoose.model("admin", adminModel)