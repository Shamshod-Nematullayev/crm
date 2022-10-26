const mongoose = require('mongoose');
const schema = mongoose.Schema({
    kurs_id: String,
    pay_id: String,
    sana: Date,
    user_id: String
})

const Pay = mongoose.model('Pay', schema)
module.exports = Pay