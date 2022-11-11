const mongoose = require('mongoose');
const schema = mongoose.Schema({
    sana: Date,
    user_id: {
        type: String,
        required: true
    },
    summ: {
        type: Number,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    isConfirm: {
        type: Boolean,
        default: false
    }
})

const TransferMoney = mongoose.model('TransferMoney', schema)
module.exports = TransferMoney