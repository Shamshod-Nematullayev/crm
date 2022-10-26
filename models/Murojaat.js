const mongoose = require('mongoose');
const schema = mongoose.Schema({
    from: String,
    to: String,
    murojaatchi: Object,
    mavzu: String,
    matn: String,
})

const Murojaat = mongoose.model("Murojaat", schema);

module.exports = Murojaat