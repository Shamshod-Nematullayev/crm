const User = require("../models/User")

const isAuth = async (req, res, next) => {
    const {user} = req.body
    const userData = await User.findOne({user_id: user.user_id})
    if(userData && user.password == userData.password){
        next()
    }else{
        return res.json({
            ok: false,
            message: 'Foydalanuvchi ma\'lumoti tasdiqlanmadi'
        })
    }
}

module.exports = {isAuth}