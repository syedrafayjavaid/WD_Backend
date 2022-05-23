const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {type: String, require:true, unique:true },
    createdDate: {type: Date, default: new Date()},
    lastModified: Date,
    active: Boolean
});


module.exports = mongoose.model('Category',categorySchema);