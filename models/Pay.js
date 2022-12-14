const mongoose = require('mongoose');
const schema = mongoose.Schema({
    kurs_id: String,
    sana: Date,
    user_id: {
        type: String,
        required: true
    },
    nimaga: {
        type: Object,
        required: true
    },
    summ: {
        type: Number,
        required: true
    },
    kimOrqali: {
        type: String,
        required: true
    },
    naqdmi: {
        type: Boolean,
        required: true
    }
})

const Pay = mongoose.model('Pay', schema)
module.exports = Pay