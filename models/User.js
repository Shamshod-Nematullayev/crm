const mongoose = require("mongoose");

const schema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    },
    job: {
        type: Object,
        default: {
            kasb: "mehmon",
            level: 'oliy'
        }
    },
    joined: {
        type: Date,
        default: Date.now()
    },
})

const User = mongoose.model('user', schema);

module.exports = User;