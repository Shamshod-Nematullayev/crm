const mongoose = require('mongoose');
const db = mongoose.connect( process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(
    console.log('Qomondon ma\'lumotlar bazasiga muvaffaqqiyatli kirib oldik')
)
.catch(err=>{
    console.log("Qomondon ma'lumotlar bazasiga kira olmayapmiz, chunki __", err);
});

module.exports = db