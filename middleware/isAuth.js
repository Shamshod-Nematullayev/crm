const User = require("../models/User")

const isAuth = async (req, res, next) => {
    const {user} = req.body
    if(req.session.auth){
        next()
    }else{
         const userData = await User.findOne({user_id: user.user_id})
         req.session.user = userData
        if(user){ 
            if(userData && user.password == userData.password){
            req.session.auth = true
            return next()
        }else{
            return res.json({
                ok: false,
                message: 'Foydalanuvchi ma\'lumoti tasdiqlanmadi'
            })
        }}
        else{
            return res.json({
                ok: false,
                message: "Foydalanuvchini topilmadi"
            })}
    }
   
}

module.exports = {isAuth}