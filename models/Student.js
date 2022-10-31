const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user_id: String,
    ism: {
        type: String,
        required: true
    },
    familiya: {
        type: String,
        required: true
    },
    otasi: {
        type: String,
    },
    jinsi: {
        type: String,
        required: true
    },
    telefon1: {
        type: String,
        required: true
    },
    telefon2: {
        type: String,
        required: true
    },
    email: String,
    address: Object,
    ijtimoiyTarmoqlarda: {
        type: Object,
        default: {
            telegram: "",
            instagram: "",
            facebook: "",
            linkedin: "",
        }
    },
    rasmi: String,
    tavalludi: Date,
    isActiv: {
        type: Boolean,
        default: false
    },
    comment: {
        type: String,
        max: 250
    },
    kurslar: {
        type: Array,
        default: []
    },
    update: Object
})

const Student = mongoose.model('Student', schema);

module.exports = Student;