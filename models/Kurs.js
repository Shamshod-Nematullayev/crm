const mongoose = require('mongoose');

const schema = mongoose.Schema({
    kurs_id: String,
    nomi: String,
    narxi: Number,
    comment: {
        type: String,
        min: 300
    },
    teacher_user_id: String,
    davomiyligi: Number,
    boshlanishSanasi: Date,
    students: Array,
    //"rahbariyatIzohi" Faqat menegmentdagilarga ko'rinadi.
    rahbariyatIzohi: {
        type: String,
        min: 300
    },
    isActive: {
        type: Boolean,
        default: false
    },
    sana: Date
})

const Kurs = mongoose.model("Kurs", schema)

module.exports = Kurs