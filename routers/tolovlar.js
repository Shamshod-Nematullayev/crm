const express = require('express');
const { isAuth } = require('../middleware/isAuth');
const Pay = require('../models/Pay');
const TransferMoney = require('../models/TransferMoney');
const User = require('../models/User');
const router = express.Router();

// to'lov qabul qilish
router.post("/income",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level < 4) {
            const pay = new Pay({
                ...req.body.pay,
                sana: Date.now(),
                kimOrqali: user.user_id
            })
            await pay.save()
                .catch(err => {
                    return res.json({
                        ok: false,
                        message: `Xatolik`
                    })
                })
                .then(() => {
                    return res.json({
                        ok: true,
                        pay
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
// to'lov haqida ma'lumotlarni chiqarish
router.post("/view/:pay_id",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level < 4) {
            await Pay.findById(req.params.pay_id)
                .then(pay => {
                    return res.json({
                        ok: true,
                        pay
                    })
                })
                .catch(err => {
                    return res.json({
                        ok: true,
                        message: `Ma'lumot topilmadi`
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

// pulni topshirish
router.post("/transfer",isAuth, async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level == 3 || user.job.level == 2){
            const transfer = new TransferMoney({
                ...req.body.transfer,
                sana: Date.now(),
                user_id: user.user_id,
                isConfirm: false
            })
            await transfer.save()
                .then(() => {
                    return res.json({
                        ok: true,
                        message: `Qabul qilindi. Pul o'tkazma tasdiqlangandan so'ng pulni topshiring`
                    })
                })
                .catch(err => {
                    return res.json({
                        ok: false,
                        message: `Qabul qilinmadi. Ma'lumotlar to'g'ri to'ldirilganiga ishonch hosil qiling`
                    })
                })
        }else{
            return res.json({
                ok: false,
                message: `Siz bunday qila olmaysiz`
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// pul qabul qilinganini tasdiqlash
router.post("/transfer/confirm",isAuth,  async (req, res) => {
    try {
        const user = req.session.user
        if(user.job.level == 1){
            await TransferMoney.findById(req.body.transfer_id)
            .then(transfer => {
                transfer.updateOne({$set: {isConfirm: true}})
                    .then(() => {
                        return res.json({
                            ok: true,
                            message: `Tasdiqlandi`
                        })
                    })
                    .catch(err => {
                        return res.json({
                            ok: false,
                            message: `Tasdiqlab bo'lmadi`
                        })
                    })
            })
            .catch(err => {
                return res.json({
                    ok: false,
                    message: `Ma'lumot topilmadi`
                })
            })
            
        }else{
            return res.json({
                ok: false,
                message: `Siz bunday qila olmaysiz`
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router