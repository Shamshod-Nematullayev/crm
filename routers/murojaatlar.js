const express = require("express");
const { isAuth } = require("../middleware/isAuth");
const Murojaat = require("../models/Murojaat");
const User = require("../models/User");
const router = express();

// murojaat yaratish
router.post("/create",isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const appeal = new Murojaat({
            ...req.body.murojaat,
            from: user_id,
            sana: Date.now()
        })
        await appeal.save()
            .then(() => {
                return res.json({
                    ok: true,
                    message: `Murojaatingiz qabul qilindi`
                })
            })
            .catch(() => {
                return res.json({
                    ok: false,
                    message: `Murojaatni saqlab bo'lmadi`
                })
            })
    } catch (error) {
        console.log(error)
    }
})
// ayni bir murojaatni o'qish
router.post("/view/:murojaat_id",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level < 4){
            const murojaat = await Murojaat.findById(req.params.murojaat_id)
            if(murojaat){
                return res.json({
                    ok: true,
                    murojaat: murojaat
                })
            }else{
                return res.json({
                    ok: false,
                    message: `Ma'lumot topilmadi`
                })
            }
        }else{
            return res.json({
                ok: false,
                message: `Siz bunday huquqga ega emassiz`
            })
        }
    } catch (error) {
        console.log(error)
    }
})
// murojaatlarni olish
router.post("/view/",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level < 4){
            const murojaatlar = await Murojaat.find()           
            return res.json({
                ok: true,
                murojaat: murojaatlar
            })
        }else{
            return res.json({
                ok: false,
                message: `Siz bunday huquqga ega emassiz`
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// murojaatni o'chirib yuborish
router.post("/delete/:murojaat_id",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level < 4){
            await Murojaat.findByIdAndDelete(req.params.murojaat_id)
                .catch(err => {
                    return res.json({
                        ok: false,
                        message: `O'chirib tashlab bo'lmadi`
                    })
                })
                .then(() => {
                    return res.json({
                        ok: true,
                        message: `O'chirib tashlandi`
                    })
                })
        }else{
            return res.json({
                ok: false,
                message: `Siz bunday huquqga ega emassiz`
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router