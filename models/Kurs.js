const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nomi: {
        type: String,
        required: true
    },
    narxi: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        min: 300
    },
    teacher_user_id: {
        type: String,
        required: true
    },
    davomiyligi: Number,
    boshlanishSanasi: Date,
    students: {
        type: Array,
        default: []
    },
    //"rahbariyatIzohi" Faqat menegmentdagilarga ko'rinadi.
    rahbariyatIzohi: {
        type: String,
        min: 300
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lastUpdate: Date,
    sana: Date
})

const Kurs = mongoose.model("Kurs", schema)

module.exports = Kurs