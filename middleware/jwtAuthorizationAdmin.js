var jwt = require('jsonwebtoken');
var userSchema = require('../models/user.model');

module.exports=async function (req,res,next) {
    const token=req.headers.authorization;
    jwt.verify(token,`${process.env.JWT_SECRET}`,async function (err,decode) {
        if(err){
            return res.status(400).send({
                status: 400,
                message: "token ไม่ถูกต้อง",
                
              });
        }
        const user = await userSchema.findById(decode.userId);
        if(!user||!user.isAdmin){
            return res.status(400).send({
                status: 400,
                message: "คุณไม่ใช admin",
                
              });
        }
        req.userId =decode.userId;
       next();
    });
}