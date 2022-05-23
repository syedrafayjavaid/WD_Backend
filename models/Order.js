const mongoose = require('mongoose');

    const orderSchema = new mongoose.Schema({
        customerName: {type: String, required: true},
        totalPrice: {type: Number, required:true},
        totalProduct: {type: Number, required:true},
        totalRevinue: {type: Number},
        contactNumber:{type: Number},
        createdDate: {type: Date, default: new Date()}
});

module.exports = mongoose.model('Order',orderSchema);
