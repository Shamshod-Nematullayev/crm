const mongoose = require('mongoose');
const schema = mongoose.Schema({
    kurs_id: String,
    sana: Date,
    user_id: String,
    nimaga: Object,
    summ: Number
})

const Pay = mongoose.model('Pay', schema)
module.exports = Pay