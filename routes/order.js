const express = require('express')
const order = express.Router()
const orderController = require("../controller/controller")
const crypto = require('crypto')

// create order
order.post("/create" , orderController.createOrder)


// delete order
order.post("/delete/:id" , orderController.deleteOrder)


// update order
order.post("/update/:id" , orderController.updateOrder)


// view all oders
order.post("/all" , orderController.allOrder)
module.exports = order