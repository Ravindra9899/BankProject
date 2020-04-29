const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    accountNo: {
        type: String,
        required: 'accountNo can\'t be empty'
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,ref:'User',
        required: 'userId can\'t be empty',
    },
    type: {
        type: String,
        required: 'type can\'t be empty',
    },
    transactionAmt: {
        type: Number,
        required: 'transactionAmt can\'t be empty',
    },
    amount: {
        type: Number,
        required: 'amount can\'t be empty',
    },
    createdAt: {
       type:Date,
       default:Date.now
    }
});
module.exports = mongoose.model('Transaction', transactionSchema);
