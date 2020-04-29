var mongoose = require('mongoose');
const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    email: { type: String, required: true},
    status:{type:Boolean,default:false},
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
});

module.exports = mongoose.model('usertoken', tokenSchema);