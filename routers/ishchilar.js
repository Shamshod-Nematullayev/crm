const express = require('express');
const { isAuth } = require('../middleware/isAuth');
const Ishchi = require('../models/Ishchi');
const User = require('../models/User');
const router = express.Router();

// Yangi User yaratish
router.post('/add',isAuth, async (req, res) => {
    const user = await User.findOne({user_id: req.body.user.user_id})
    if(user.job.level > 4){
        const yangiIshchi = new Ishchi({
            ...req.body.ishchi,
            joined: Date.now()
        })
        await yangiIshchi.save();
    }else{
        res.json({
            ok: false,
            message: "Siz bunday huquqga ega emassiz"
        })
    }
})

// Ishchini aktivlashtirish
router.post("/active",isAuth, async (req, res) => {
    const user = await User.findOne({user_id: req.body.user.user_id})
    if(user.job.level > 3){
        const ishchi = await Ishchi.findById(req.body.ishchi_id)
        await ishchi.updateOne({$set: {
            isActiv: true,
            actived: Date.now(),
            kelishilganMaosh: req.body.maosh,
            job: req.body.job
        }})
    }else{
        res.json({
            ok: false,
            message: "Siz bunday huquqga ega emassiz"
        })
    }
})
// Ishchini ishdan bo'shatish
router.post("/unactive",isAuth, async (req, res) => {
    const user = await User.findOne({user_id: req.body.user.user_id})
    if(user.job.level > 3){
        const ishchi = await Ishchi.findById(req.body.ishchi_id)
        await ishchi.updateOne({$set: {
            isActiv: false,
            kelishilganMaosh: req.body.maosh
        }})
    }else{
        res.json({
            ok: false,
            message: "Siz bunday huquqga ega emassiz"
        })
    }
})
// Ishchini maoshini o'zgartirish
router.post("/editpay",isAuth, async (req, res) => {
    const user = await User.findOne({user_id: req.body.user.user_id})
    if(user.job.level > 3){
        const ishchi = await Ishchi.findById(req.body.ishchi_id)
        await ishchi.updateOne({$set: {
            kelishilganMaosh: req.body.maosh
        }})
    }else{
        res.json({
            ok: false,
            message: "Siz bunday huquqga ega emassiz"
        })
    }
})

module.exports = router
