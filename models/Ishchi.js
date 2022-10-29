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
        type: String
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
    tavalludi: {
        type: Date,
        required: true
    },
    malumoti: String,
    isActiv: {
        type: Boolean,
        default: false
    },  
    actived: Date,
    kelishilganMaosh: Number,
    talabQilinganMaosh: Number,
    comment: {
        type: String,
        max: 250
    },
    bonus: {
        type: Array,
        default: []
    },
    jarima: {
        type: Array,
        default: []
    },
    holidays: {
        type: Array,
        default: []
    },
    vakansiya_id: String,
    job: String,
    joined: Date,
    filialCode: {
        type: Number,
        required: true
    }
})

const Ishchi = mongoose.model('Ishchi', schema);

module.exports = Ishchi;