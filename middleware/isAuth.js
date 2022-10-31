const User = require("../models/User")

const isAuth = async (req, res, next) => {
    const {user} = req.body
    console.log(req.session)
    if(req.session){
        next()
    }else{
         const userData = await User.findOne({user_id: user.user_id})
        if(user) if(userData && user.password == userData.password){
            req.session.auth = true
            console.log(req.session)
            next()
        }else{
            return res.json({
                ok: false,
                message: 'Foydalanuvchi ma\'lumoti tasdiqlanmadi'
            })
        }
        else res.json({
            ok: false,
            message: "Foydalanuvchini topilmadi"
        })
        return res.json({
                ok: false,
                message: 'Foydalanuvchi ma\'lumoti tasdiqlanmadi'
            })
    }
   
}

module.exports = {isAuth}