const express = require('express');
const { isAuth } = require('../middleware/isAuth');
const Count = require('../models/Count');
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
        let user_id = generateUserId(user, filial)
        let password = Math.floor(Math.random() * 100000000)
        await ishchi.updateOne({$set: {
            isActiv: true,
            actived: Date.now(),
            kelishilganMaosh: req.body.maosh,
            job: req.body.job.kasb,
            username
        }}).then(async () => {
            const newUser = new User({
                user_id,
                password
            })
            await newUser.save()
                .then(() => {
                    res.json({
                        ok: true,
                        newUser: {
                            user_id,
                            password
                        },
                        message: 'Yangi foydalanuvchi qo`shildi'
                    })
                })
        })
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
async function generateUserId(user, filial){
    let user_id = ''
    const counts = await Count.find()
    let count = 0
    if(counts.length > 0){
        count = counts[0].userTartibRaqami
    }
    let unikalRaqam = ''
    let jinsKodi = ''
    if(Math.floor(count/10) < 1){
        unikalRaqam = '000'+count
    }else if(Math.floor(count/100) < 1){
        unikalRaqam = '00'+count
    }else if(Math.floor(count/10) < 1){
        unikalRaqam = '0'+count
    }else{
        unikalRaqam = count
    }
    if(user.jinsi == "Erkak") jinsKodi = 'M'
    else jinsKodi = "W"
    user_id = filial + jinsKodi + unikalRaqam
    await Count.findOne().updateOne({userTartibRaqami: count+1})
    return user_id
}
async function setUsername(user, username = '', count = 0){
    username = user.ism + user.familiya + count
    const users = await User.find()
    users.forEach(u => {
        if(u.username == username){
            return setUsername(user, username, count+1)
        }
    })
    return username
}

module.exports = router
