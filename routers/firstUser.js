const express = require("express")
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
    const users = await User.find()
    if(users.length < 1){
        const userData = {
            ...req.body,
            joined: Date.now()
        }
        const user = new User(userData)
        await user.save()
        .then(r => res.json({
            ok: true,
            ...r
        }))
    }else{
        return res.json({
            ok: false,
            message: "Error"
        })
    }
})

module.exports = router