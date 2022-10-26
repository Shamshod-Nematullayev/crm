// Bismillahi rahmaniy rohiym
const express = require('express');
const app = express();
require('dotenv').config()
require('./config/mongodb')

app.use(express.json())
app.use(express.urlencoded())

// USE ROUTERS  
app.use('/auth/login', require('./routers/login'))
app.use('/firstUser', require("./routers/firstUser"))
app.use('/employee', require("./routers/ishchilar"))


const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`Server listening port ${PORT}}`))