const mongoose = require('mongoose');
const schema = mongoose.Schema({
    mavzu: String,
    comment: String,
    summasi: Number,
    sana: Date
})

const Xarajat = mongoose.model('Xarajat', schema)
module.exports = Xarajat