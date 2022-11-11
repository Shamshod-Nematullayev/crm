// Bismillahi rahmaniy rohiym
const express = require('express');
const app = express();
require('dotenv').config()
const mongoose = require('mongoose');
const cors = require('cors')
const connectDatabase = async () => {
    try {
    //   mongoose.set("useNewUrlParser", true);
      
      await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true
      })
        .then(
            console.log('Qomondon ma\'lumotlar bazasiga muvaffaqqiyatli kirib oldik')
        )
        .catch(err=>{
            console.log("Qomondon ma'lumotlar bazasiga kira olmayapmiz, chunki __", err);
        });
  
      console.log("connected to database");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  connectDatabase();
  const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// mongoose.connect( process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(
//     console.log('Qomondon ma\'lumotlar bazasiga muvaffaqqiyatli kirib oldik')
// )
// .catch(err=>{
//     console.log("Qomondon ma'lumotlar bazasiga kira olmayapmiz, chunki __", err);
// });

const session = require("express-session")
const store = new session.MemoryStore()
module.exports = {store}
app.use(session({
    secret: "sirli nimadur",
    cookie: {maxAge: 30000},
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// USE ROUTERS  
app.use('/auth/login', require('./routers/login'))
app.use('/firstUser', require("./routers/firstUser"))
app.use('/employee', require("./routers/ishchilar"))
app.use('/courses', require("./routers/kurslar"))
app.use("/students", require("./routers/studentlar"))
app.use("/costs", require("./routers/xarajat"))
app.use("/appeals", require("./routers/murojaatlar"))
app.use("/pays", require("./routers/tolovlar"))


const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server listening port ${PORT}}`))