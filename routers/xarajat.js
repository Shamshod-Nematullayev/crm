const express = require(`express`);
const { isAuth } = require("../middleware/isAuth");
const User = require("../models/User");
const Xarajat = require("../models/Xarajat");
const router = express.Router();

// xarajat yaratish
router.post("/add",isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        if(user.job.level < 5){
            const xarajat = new Xarajat({
                ...req.body.xarajat,
                kim: user_id,
                sana: Date.now(),
                isActiv: false
            })
            await xarajat.save()
            res.json({
                ok: true,
                message: 'Qabul qilindi'
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
// xarajatni tasdiqlash
router.post("/accept",isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        if(user.job.level < 2){ // Tasischi bo'lsa
            const xarajat = await Xarajat.findById(req.body.xarajat_id)
            if(xarajat){
                await xarajat.updateOne({$set: {isActiv: true}})
                    .then(() => {
                        return res.json({
                            ok: true,
                            message: `Xarajat tasdiqlandi`
                        })
                    })
                    .catch( err => {
                        return res.json({
                            ok: false,
                            message: `Ma'lumotni yangilab bo'lmadi`
                        })
                    })
            }else{
                return res.json({
                    ok: false,
                    message: `Siz yuborgan xarajat haqida ma'lumot topilmadi`
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

module.exports = router