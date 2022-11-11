const mongoose = require('mongoose');
const schema = mongoose.Schema({
    mavzu: {
        type: String,
        required: true
    },
    comment: String,
    summasi: {
        type: Number,
        required: true
    },
    kim: {
        type: String,
        required: true
    },
    sana: Date,
    isActiv: {
        type: Boolean,
        default: false
    }
})

const Xarajat = mongoose.model('Xarajat', schema)
module.exports = Xarajat