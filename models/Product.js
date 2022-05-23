const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {type: String, required:true},
    quantity: {type: Number, required:true},
    purchaseCost: {type: Number, required:true},
    salePrice: {type: Number, required:true},
    brand: {type: String, required:true},
    category: {type: String, required:true},
    subCategory:{type: String, required:true},
    orderCount: {type: Number},
    description:{type:String, require:true},
    createdDate: {type: Date, default: new Date()},
    lastModified: Date
});

module.exports = mongoose.model('Product',ProductSchema);
