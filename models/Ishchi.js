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
    qonGuruhi: String,
    rasmi: String,
    tavalludi: Date,
    diplomSertifikatlar: Array,
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
    vakansiya_id: String,
    job: String,
    joined: Date
})

const Ishchi = mongoose.model('Ishchi', schema);

module.exports = Ishchi;