const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
   try {
        console.log("keldi  ")
       const {user_id, password} = req.body;
       const user = await User.findOne({user_id})
    if(!user || user.password !==password){
        return res.json({
            ok: false,
            message: 'Login yoki parol tasdiqlanmadi'
        })
    }else{
        req.session.auth = true
        console.log(req.session)
        console.log(req.sessionID)
        return res.statusCode(200).json({
            ok: true,
            user
        })
    }
   } catch (err) {
    console.log(err)
   }
})

module.exports = router
