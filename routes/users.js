var express = require("express");
var router = express.Router();
var userSchema = require("../models/user.model");
var bcrypt = require("bcrypt");
var jwtAdmin =require("../middleware/jwtAuthorizationAdmin");
/* GET users listing. */
router.get("/users", async function (req, res, next) {
  try {
    //throw{status:400}
    let user = await userSchema.find({});
    res.status(200).send({
      status: 200,
      message: "success",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "not success",
      data: [],
    });
  }
});
router.post("/register", async function (req, res, next) {
  try {
    let { name, password, email } = req.body;
    
    let user = new userSchema({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10), 
    });
    await user.save();
    res.status(201).send({
      status: 200,
      message: "success",
      data: user,
      // dataEmail: user.email,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "เพิ่มผู้ใช้งานล้มเหลว",
      dataName: user.name,
      dataEmail: user.email,
    });
  }
});

router.put("/users/:id/approve",[jwtAdmin], async function (req, res, next) {
  let { isApprove } = req.body;
  let { id } = req.params;
  try {
    //let userId = req.params.id;
    let user = await userSchema.findByIdAndUpdate(
      id,
      { isApprove },
      { new: true }
    );
    if(!user){
      return res.status(401).send("ไม่พบผู้ใช้งาน");
    }
    res.status(201).send({
      status: 201,
      message: "approve success",
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "approveล้มเหลว",
    });
  }
});

module.exports = router;
