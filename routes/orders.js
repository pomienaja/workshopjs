var express = require("express");
var router = express.Router();

var orderSchema = require("../models/order.model");
const jwtAuthorization = require("../middleware/jwtAuthorization");

router.get('/orders',[jwtAuthorization],async function (req,res,next) {
    try {
        const orders=await orderSchema.find();
         res.status(200).send({
            status: 200,
            message: "ดึงข้อมูลสำเร็จ",
            data: orders,
          });
    } catch (error) {
         res.status(400).send({
            status: 400,
            message: "ดึงข้อมูลไม่สำเร็จ",
            data: [],
          });
    }
    
})
module.exports = router;