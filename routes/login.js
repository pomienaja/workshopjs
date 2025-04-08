var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
var bcrypt = require("bcrypt");
var jwt =require('jsonwebtoken');
/* GET users listing. */
router.post("/login", async function (req, res, next) {
  let { email, password } = req.body;
  let user = await userSchema.findOne({ email });
  
  if(!user) {
    return res.status(401).send({
      status: 401,
      message: "ไม่พบข้อมูลผู้ใช้",
      data: [],
    });
  }
  if (!user.isApprove) {
    return res.status(401).send({
      status: 401,
      message: "not Approve",
    });
  }
  const isPassword = await bcrypt.compare(password,user.password)
  if(!isPassword){
    return res.status(401).send({
      status:401,
      message:"รหัสผ่านไม่ถูกต้อง"
    })
  }
  let token = await jwt.sign({userId:user._id},`${process.env.JWT_SECRET}`);
  res.status(200).send({
    status:200,
    message:"เข้าสู่ระบบสำเร็จ",
    token
  })

  
  
});

module.exports = router;
