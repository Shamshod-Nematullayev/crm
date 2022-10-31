const express = require('express');
const { isAuth } = require('../middleware/isAuth');
const Count = require('../models/Count');
const Student = require('../models/Student');
const User = require('../models/User');
const router = express.Router();

// create student
router.post("/create", isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const {studentData, filialCode} = req.body
        const user = await User.findOne({user_id})
        if(user.job.level){
            const student_id = await generateUserId(studentData.jinsi, filialCode)
            let password = Math.floor(Math.random() * 100000000)
            if(!student_id) return false
            const student = new Student({
                user_id: student_id,
                ...studentData,
            })
            await student.save()
                .then(async () => {
                    const newUser = new User({
                        user_id: student_id,
                        password,
                        job: {
                            kasb: "O'quvchi",
                            level: 5
                        },
                        joined: Date.now()
                    })
                    await newUser.save()
                        .then(() => res.json({
                            ok: true,
                            user: {
                                user_id: student_id,
                                password
                            }
                        }))
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
// read student
router.post("/view/:student_id",isAuth, async ( req, res ) => {
    try {
        const {user_id} = req.body.user
        const user = await User.findOne({user_id})
        if(user.job.level < 5){
            const student = await Student.findOne({user_id: req.params.student_id})
            if(student){
                res.json({
                    ok: true,
                    student
                })
            }else{
                res.json({
                    ok: false,
                    message: `Bunday o'quvchi topilmadi`
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
// update student
router.post('/update',isAuth, async (req, res) => {
    try {
        const {user_id} = req.body.user
        const {student_id, studentData} = req.body
        const user = await User.findOne({user_id})
        if(user.job.level < 4) {
            await Student.findOneAndUpdate({user_id: student_id}, {
                $set: {
                    student_id,
                    ...studentData,
                    update: {
                        updated: Date.now(),
                        from: user_id
                    }
                }
            })
                .then(() => {
                    res.json({
                        ok: true,
                        message: `O'quvchi ma'lumoti yangilandi`
                    })
                })
                .catch(err => {
                    res.json({
                        ok: false,
                        message: `O'quvchi ma'lumotini yangilab bo'lmadi`
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
// delete student
router.post("/delete", isAuth,async (req, res) => {
    try {
        const {user_id} = req.body.user
        const {student_id} = req.body
        const user = await User.findOne({user_id})
        if(user.job.level < 4) {
            await Student.findOneAndDelete({user_id: student_id})
                .then(() => {
                    res.json({
                        ok: true,
                        message: `O'quvchi ma'lumoti o'chirib tashlandi`
                    })
                })
                .catch(err => {
                    res.json({
                        ok: false,
                        message: `O'quvchi ma'lumotini o'chirib bo'lmadi`
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

async function generateUserId(jins, filialCode){
    let user_id = ''
    const counts = await Count.find()
    let count = 0
    if(counts.length > 0){
        count = counts[0].userTartibRaqami
        await Count.findOne().updateOne({userTartibRaqami: count+1})
    }else{
        await new Count({
            userTartibRaqami: 2
        }).save()
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
    if(jins == "Erkak") {jinsKodi = 'M'}
    else if (jins == "Ayol")
        {jinsKodi = "W"}
        else {return false}
        user_id = "S" + filialCode + jinsKodi + unikalRaqam
    return user_id
}

module.exports = router