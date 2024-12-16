const orderModel = require("../model/order");
const crypto = require('crypto')


// order logic
const createOrder = async (req, res) => {
  const {
    customername,
    productname,
    quantity,
    contact,
    address,
    region,
    zip,
    payment,
    cardholder,
    cardnumber,
    expiredate,
    cvv,
    price,
  } = req.body;

  // create orde token
  const orderid = crypto.randomBytes(5).toString("hex", 0, 9).toUpperCase();

  // order object
  const orderObject = {
    orderId: orderid,
    customername: customername,
    productname: productname,
    quantity: quantity,
    contact: contact,
    address: address,
    region: region,
    zip: zip,
    paymentmethod: payment,
    creditcardholder: cardholder,
    cardnumber: cardnumber,
    expirationdate: expiredate,
    cvv: cvv,
    price: price,
    status: "pending",
  };

  // create order
  try {
    const newOrder = await orderModel.create(orderObject);
    if (!newOrder) {
      throw new Error("Internal Server Error!");
    }

    res.status(201);
    res.redirect("/orderPage");
  } catch (err) {
    next(err);
  }
};

// delete order
const deleteOrder = async(req, res, next) => {
    const orderId = req.params.id

    try {
        const orderDeleted = await orderModel.findByIdAndDelete(orderId)
        res.json(orderDeleted)
    } catch (err) {
        next(err)
    }
};

// updated order
const updateOrder = async (req, res, next) => {
    const orderId = req.params.id

    try {
        const orderUpdate = await orderModel.findByIdAndUpdate(orderId)
        res.json(orderUpdate)
    } catch (err) {
        next(err)
    }
    
};

const allOrder = async(req, res, next) => {
    try{
        const allOrders = await orderModel.find()
        if(allOrder == null){
            res.status(404)
            req.flash("No Order Found")
            return res.redirect("/pages/dashboard")
        }

        res.json(allOrders)
    }catch(err){
        next(err)
    }
}

// export modules
module.exports = {
  updateOrder,
  deleteOrder,
  createOrder,
  allOrder
};
