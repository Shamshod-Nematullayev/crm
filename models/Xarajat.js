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
    sana: Date
})

const Xarajat = mongoose.model('Xarajat', schema)
module.exports = Xarajat