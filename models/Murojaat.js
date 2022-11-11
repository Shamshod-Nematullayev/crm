const mongoose = require('mongoose');
const schema = mongoose.Schema({
    from: String,
    to: String,
    murojaatchi: String,
    mavzu: String,
    matn: String,
    sana: Date
})

const Murojaat = mongoose.model("Murojaat", schema);

module.exports = Murojaat