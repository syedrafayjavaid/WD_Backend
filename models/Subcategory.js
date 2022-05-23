const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    subCategoryName: {type: String, require:true, unique:true },
    categoryName: {type: String, require:true },
    createdDate: {type: Date, default: new Date()},
    lastModified: Date,
    active: Boolean
});


module.exports = mongoose.model('Subcategory',subcategorySchema);