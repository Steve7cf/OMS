const mongoose = require('mongoose')
const orderModel = new mongoose.Schema({
    orderId:{
        type:String,
        required:[true, "Please Enter Order Id"],
        unique:[true, "Order ID should be unique"]
    },
    customerName:{
        type:String,
        lowercase:true,
        required:[true, "Please Enter customer name"],
    },
    productName:{
        type:String,
        required:[true, "Please Enter Product name"],
    },
    quantity:{
        type:String,
        default:"1"
    },
    contact:{
        type:String,
        required:[true, "contact Is Required"],
    },
    address:{
        type:String,
        default:'Tanzania'
    },
    region:{
        type:String,
        default:"dar es salaam"
    },
    zip:{
        type:String,
        default:"1"
    },
    paymentMethod:{
        type:String,
        default:"credit card"
    },
    creditCardHolder:{
        type:String,
        default:"1"
    },
    cardNumber:{
        type:String,
        default:"000-000-000-000"
    },
    expirationDate:{
        type:Date,
        default:Date.now()
    },
    cvv:{
        type:String,
        default:"0000"
    },
    price:{
        type:String,
        default:"1"
    },
    price:{
        type:String,
        default:"1"
    },
    status:{
        type:String,
        enum:["pending", "delivered"],
        default:"pending"
    },
},
    {timestamps:true,}
)

module.exports = mongoose.model("orders", orderModel)