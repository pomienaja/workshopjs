var express = require("express");
var router = express.Router();

var productSchema = require("../models/product.model");
var orderSchema = require("../models/order.model");

var multer = require("multer");
var fs = require("fs");
var path = require("path");
var getUserIdFromToken = require("../userIdFromToken");
const jwtAuthorization = require("../middleware/jwtAuthorization");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
   // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/products", [jwtAuthorization], async function (req, res, next) {
  const userId = getUserIdFromToken(req.headers.authorization);
 
  console.log(userId);
  
  try {
    let products =await productSchema.find({customer:userId});
    res.status(200).send({
      status: 200,
      message: "ขอข้อมูลสินค้าสำเร็จ",
      data: products,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "ขอข้อมูลสินค้าไม่สำเร็จ",
      data: [],
    });
  }
});
router.post("/products",[jwtAuthorization, upload.single("image")],async function (req, res, next) {
    const { productName, price, description, quantity } = req.body;
    const image = req.file ? req.file.fieldname : null;
    const userId = getUserIdFromToken(req.headers.authorization);
  
    try {
      const product = new productSchema({
        productName:productName,
        price:price,
        description:description,
        image:image,
        quantity:quantity,
        customer: userId,
      });
      //const product = new product({productName,price,description,image,quantity});
      await product.save();
      res.status(200).send({
        status: 200,
        message: "เพิ่มข้อมูลสินค้าสำเร็จ",
        data: product,
      });
    } catch (error) {
      res.status(400).send({
        status: 400,
        message: "เพิ่มข้อมูลสินค้าไม่สำเร็จ",
        data: [],
      });
    }
  }
);
router.put("/products/:id", [jwtAuthorization, upload.single("image")], async function (req, res, next) {
    const userId = getUserIdFromToken(req.headers.authorization);
    const { id } = req.params;
    const { productName, price, description, quantity } = req.body;
    const image=req.file ? req.file.filename:null;

    try {
    
      const product =await productSchema.findById(id,{customer:userId})
      if(!product){
        return res.status(500).send({
          status: 500,
          message: "ไม่พบข้อมูลสินค้า",
          data: [],
        });
      }
      const productData = { productName, price, description, quantity, image };
      if(image){
        const oldImage = product.image;
        if(oldImage){
          const imagePath=path.join(__dirname,'../public/images',oldImage);
          if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
          }
        }
      }
      const upDateProduct= await productSchema.findByIdAndUpdate(id,productData,{new:true});
      
      res.status(200).send({
        status: 200,
        message: "แก้ไขข้อมูลสินค้าสำเร็จ",
        data: upDateProduct,
      });
    } catch (error) {
      res.status(400).send({
        status: 400,
        message: "แก้ไขข้อมูลสินค้าไม่สำเร็จ",
        data: [],
      });
    }
  }
);
router.delete("/products/:id",[jwtAuthorization], async function (req, res, next) {
  const userId = getUserIdFromToken(req.headers.authorization);
  const { id } = req.params;
  
  try {
   await productSchema.findByIdAndDelete(id,{customer:userId});
    res.status(200).send({
      status: 200,
      message: "ลบข้อมูลสินค้าสำเร็จ",
      data:productSchema
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "ลบข้อมูลสินค้าไม่สำเร็จ",
      data: [],
    });
  }
});

router.get("/products/:id/orders",[jwtAuthorization],async function (req,res,next) {
  const {id}= req.params;
  const orders = await orderSchema.find({productId:id});
  try {
    res.status(200).send({
      status: 200,
      message: "ดึงคำสั่งซื้อสำเร็จ",
      data:orders
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "ดึงคำสั่งซื้อไม่สำเร็จ",
      data:[]
    });
  }
})

router.post("/products/:id/orders",[jwtAuthorization],async function (req, res, next) {
const {id}=req.params;
const {quantity}=req.body;
const order = await orderSchema.find({productId:id});
const total = order.reduce((acc,curr)=>acc+curr.quantity,0);

  try {
    const product = await productSchema.findById(id);
    if(!product){
      return res.status(500).send({
        status: 500,
        message: "ไม่พบข้อมูล",
        data: [],
      });
    }
    if(product.quantity<quantity+total){
      return res.status(400).send({
        status: 400,
        message: "จำนวนไม่เพียงพอ",
        data: [],
      });
    }
    const order =new orderSchema({
      productId:id,
      quantity:quantity,
    })
    await order.save();
    res.status(200).send({
      status: 200,
      message: "เพิ่มรายการสำเร็จ",
      data: order,
    });
  } catch (error) {
    res.status(400).send({
      status: 400,
      message: "เพิ่มรายการไม่สำเร็จ",
      data: [],
    });
  }
}
);
module.exports = router;
