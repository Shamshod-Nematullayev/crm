const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userTartibRaqami: {
        type: Number,
        default: 0
    }
})

const Count = mongoose.model("Count", schema)
module.exports = Count