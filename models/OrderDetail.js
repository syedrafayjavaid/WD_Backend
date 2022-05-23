const mongoose = require('mongoose');

const  orderDetailsSchema = new mongoose.Schema({
    orderId:{type: String, required:true},
    productId:{type: String, required:true},
    productName:{type: String, required:true},
    quantity:{type: Number, required:true},
    price:{type: Number, required:true},
    brand: String,
    description:String
    
});

module.exports = mongoose.model('OrderDetail',orderDetailsSchema);