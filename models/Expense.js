const mongoose = require('mongoose');

    const expenseSchema = new mongoose.Schema({
        title: {type: String, required: true},
        detail: {type: String, required:true},
        amount: {type: Number, required:true},
        createdDate: {type: Date, default: new Date()},
        lastModified: Date
});

module.exports = mongoose.model('Expense',expenseSchema);
