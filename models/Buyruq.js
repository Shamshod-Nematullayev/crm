const mongoose = require('mongoose');
const schema = mongoose.Schema({
    mavzu: String,
    matn: String,
    muddati: Date,
    bajarildi: {
        type: Boolean,
        default: false
    },
    sana: Date
})

const Buyruq = mongoose.model('Buyruq', schema)
module.exports = Buyruq