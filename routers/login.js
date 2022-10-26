const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
   try {
    const {username, password} = req.body;
    const user = await User.findOne({username})
    if(!user || user.password !==password){
        return res.json({
            ok: false,
            message: 'Login yoki parol tasdiqlanmadi'
        })
    }else{
        return res.json({
            ok: true,
            user
        })
    }
   } catch (err) {
    console.log(err)
   }
})

module.exports = router
