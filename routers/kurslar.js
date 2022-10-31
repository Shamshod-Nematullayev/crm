const express = require('express')
const { isAuth } = require('../middleware/isAuth')
const Kurs = require('../models/Kurs')
const Student = require('../models/Student')
const User = require('../models/User')
const router = express.Router()
// kurs yaratish
router.post("/create",isAuth, async (req, res) => {
    try {
        const { user_id } = req.body.user
        const {kurs} = req.body
        const user = await User.findOne( { user_id } )
        if(user.job.level < 4) {
            const course = new Kurs({
                ...kurs,
                isActive: false,
                sana: Date.now()
            })
            await course.save()
                .then( () => {
                    res.json({
                        ok: true,
                        message: `Bazaga yangi kurs qo'shildi`
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

// kursga o'quvchini ro'yxatdan o'tkazish
router.post("/join",isAuth, async (req, res) => {
    try {
        const { user_id } = req.body.user
        const { kurs_id, student_id } = req.body
        const user = await User.findOne( { user_id } )
        if(user.job.level < 4) {
            const kurs = await Kurs.findById(kurs_id)
            if(kurs){
                const student = await Student.findOne({student_id})
                if(student){
                    await student.updateOne({$push: {kurslar: kurs._id}})
                        .then(async () => {
                            await kurs.updateOne({$push: {students: student.user_id}})
                                .then(() => {
                                    return res.json({
                                        ok: true,
                                        message: "O'quvchi kursga olindi"
                                    })
                                })
                        })
                }else{
                    return res.json({
                        ok: false,
                        message: "O'quvchi topilmadi"
                    })
                }
            }else{
                return res.json({
                    ok: false,
                    message: "Kurs manzili noto'g'ri ko'rsatildi"
                })
            }
        }else{
            return res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})
// o'quvchini kurs ro'yxatidan chiqarib yuborish
router.post("/leave",isAuth, async (req, res) => {
    try {
        const { user_id } = req.body.user
        const { kurs_id, student_id } = req.body
        const user = await User.findOne( { user_id } )
        if(user.job.level < 4) {
            const kurs = await Kurs.findById(kurs_id)
            if(kurs){
                const student = await Student.findOne({student_id})
                if(student){
                    await student.updateOne({$pull: {kurslar: kurs._id}})
                        .then(async () => {
                            await kurs.updateOne({$pull: {students: student.user_id}})
                                .then(() => {
                                    return res.json({
                                        ok: true,
                                        message: "O'quvchi kurs ro'yxatidan olib tashlandi"
                                    })
                                })
                        })
                }else{
                    return res.json({
                        ok: false,
                        message: "O'quvchi topilmadi"
                    })
                }
            }else{
                return res.json({
                    ok: false,
                    message: "Kurs manzili noto'g'ri ko'rsatildi"
                })
            }
        }else{
            return res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})
// kurs ma'lumotlarini o'zgartirish
router.post("/edit",isAuth, async (req, res) => {
    try {
        const { user_id } = req.body.user
        const { kurs_id, kurs_data} = req.body
        const user = await User.findOne({user_id})
        if(user.job.level < 4 ){
            const kurs = await Kurs.findById(kurs_id)
            if(kurs){
                await kurs.updateOne({$set: {
                    ...kurs_data,
                    lastUpdate: Date.now()
                }})
                    .then(() => {
                        return res.json({
                            ok: true,
                            message: `Kurs ma'lumotlari yangilandi`
                        })
                    })
            }else{
                return res.json({
                    ok: false,
                    message: "Kurs manzili noto'g'ri ko'rsatildi"
                })
            }
        }else{
            return res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

// kurs haqida ma'lumot olish
router.get("/:kurs_id", async (req, res) => {
    try {
        const kurs = await Kurs.findById(req.params.kurs_id)
        if(kurs){
            const {comment, rahbariyatIzohi, ...course} = kurs._doc
            return res.json({
                ok: true,
                course
            })
        }else{
            return res.json({
                ok: false,
                message: `Kurs haqida ma'lumot topilmadi`
            })
        }
    } catch (error) {
        console.log(error)
    }
})
// barcha kurslarni json formatida yuborish
router.get("/", async (req, res) => {
    try {
        const kurslar = await Kurs.find()
        const courses = []
         kurslar.forEach(kurs => {
            const {comment, rahbariyatIzohi, ...course} = kurs._doc
            courses.push(course)
        })
        return res.json({
            ok: true,
            courses
        })
    } catch (error) {
        console.log(error)
    }
})
// kursni yakunlash |O'chirib tashlash|
router.post("/remove",isAuth,async (req, res) => {
    try {
        const { user_id } = req.body.user
        const { kurs_id } = req.body
        const user = await User.findOne({user_id})
        if(user.job.level < 4){
            const kurs = await Kurs.findOne({_id: kurs_id})
            console.log(kurs)
            if(kurs){
            await Kurs.findByIdAndDelete(kurs_id)
                .catch(err => {
                    return res.json({
                        ok: false,
                        message: `Kurs topilmadi`
                    })
                })
                .then(() => {
                    return res.json({
                        ok: true,
                        message: `Kurs muvaffaqqiyatli o'chirib tashlandi`
                    })
                })
            }else{
                return res.json({
                    ok: false,
                    message: "Kurs mavjud emas"
                })
            }
        }else{
            return res.json({
                ok: false,
                message: "Siz bunday huquqga ega emassiz"
            })
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router