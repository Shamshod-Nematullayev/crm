const express = require('express');
const { isAuth } = require('../middleware/isAuth');
const Count = require('../models/Count');
const Ishchi = require('../models/Ishchi');
const Pay = require('../models/Pay');
const User = require('../models/User');
const router = express.Router();

// Ish so'rab kelganlarni ro'yhatga olish
router.post('/add',isAuth, async (req, res) => {
    try {
        const user = await User.findOne({user_id: req.body.user.user_id})
        if(user.job.level < 4){
            const yangiIshchi = new Ishchi({
                ...req.body.ishchi,
                isActiv: false,
                joined: Date.now()
            })
            await yangiIshchi.save().then(() => {
                res.json({
                    ok: true,
                    message: `${req.body.ishchi.familiya} ${req.body.ishchi.ism} ish so'rab kelganlar ro'yxatiga qo'shildi`
                })
            })
        }else{
            res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Ishchini aktivlashtirish
router.post("/active",isAuth, async (req, res) => {
    try {        
        const user = await User.findOne({user_id: req.body.user.user_id})
        if(user.job.level < 3){
            const ishchi = await Ishchi.findById(req.body.ishchi_id)
            let user_id =await generateUserId(user, req.body.filialCode)
            let password = Math.floor(Math.random() * 100000000)
            await ishchi.updateOne({$set: {
                user_id,
                isActiv: true,
                actived: Date.now(),
                kelishilganMaosh: req.body.maosh,
                job: req.body.job.kasb,                
                filialCode: req.body.filialCode
            }}).then(async () => {
                const newUser = new User({
                    user_id,
                    password,
                    job: req.body.job
                })
                await newUser.save()
                    .then(async () => {   
                        const counts = await Count.find()
                        let count = 1
                        if(counts.length > 0){
                            count = counts[0].userTartibRaqami
                            await Count.findOne().updateOne({userTartibRaqami: count+1})
                        }else{
                            await new Count({
                                userTartibRaqami: 2
                            }).save()
                        }      
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
    } catch (error) {
        console.log(error)
    }
})
// Ishchini ishdan bo'shatish
router.post("/unactive",isAuth, async (req, res) => {
    const user = await User.findOne({user_id: req.body.user.user_id})
    if(user.job.level < 3){
        const ishchi = await Ishchi.findOne({user_id: req.body.ishchi_id})
        await ishchi.updateOne({$set: {
            isActiv: false
        }}).then(() => {
            res.json({
                ok: true,
                message: "Ishchi ishdan bo'shatildi"
            })
        })
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
    if(user.job.level < 3){
        const ishchi = await Ishchi.findById(req.body.ishchi_id)
        await ishchi.updateOne({$set: {
            kelishilganMaosh: req.body.maosh
        }}).then(() => {
            res.json({
                ok: true,
                message: "Ishchining maoshi o'zgartirildi"
            })
        })
    }else{
        res.json({
            ok: false,
            message: "Siz bunday huquqga ega emassiz"
        })
    }
})

// Ishchining hisobiga rag'bat qo'shish
router.post('/bonus', isAuth, async (req, res) => {
    try {
        const user = await User.findOne({user_id: req.body.user.user_id})
        const {comment, summ} = req.body
        if(user.job.level < 3){
            await Ishchi.updateOne({user_id: req.body.ishchi_id}, {$push: {
                bonus: {
                    comment,
                    summ,
                    sana: Date.now()
                }
            }}).then(() => {
                res.json({
                    ok: true,
                    message: "Ishchining hisobiga rag'bat qo'shildi"
                })
            })
        }else{
            res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Ishchiga jarima kiritish
router.post('/jarima', isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        const {comment, summ} = req.body
        if(user.job.level < 3){
            await Ishchi.updateOne( {user_id: req.body.ishchi_id},{$push: {
                jarima: {
                    comment,
                    summ,
                    sana: Date.now()
                }
            }}).then(() => {
                res.json({
                    ok: true,
                    message: "Ishchining hisobiga jarima qo'shildi"
                })
            })
        }else{
            res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error);
    }
})

// Ishchiga ta'til e'lon qilish
router.post('/holiday', isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        if(user.job.level < 3){
            await Ishchi.updateOne(
                {
                    user_id: req.body.ishchi_id
                }, 
                {
                    $push: {
                        holidays: {
                            start: req.body.start,
                            end: req.body.end,
                            summ: req.body.summ,
                            comment: req.body.comment
                        }
                    }
                })
                .then(() => {
                    res.json({
                        ok: true,
                        message: "Ishchining ta'til vaqti belgilandi"
                    })
                })
        }else{
            res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// Ishchiga oylik maosh to'lab berish
router.post('/pay',isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        if(user.job.level < 3){
            await Ishchi.updateOne({user_id: req.body.ishchi_id}, {$set: {bonus: [], jarima: []}})
            const pay = new Pay({
                sana: Date.now(),
                user_id: req.body.ishchi_id,
                nimaga: {
                    yil: req.body.yil,
                    oy: req.body.oy,
                },
                summ: req.body.summ
            })
            await pay.save()
                .then(() => {
                    res.json({
                        ok: true,
                        message: `Oylik maosh to'lab berildi`
                    })
                })
        }else{
            res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

async function generateUserId(user, filialCode){
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
    user_id = filialCode + jinsKodi + unikalRaqam
    return user_id
}

module.exports = router
