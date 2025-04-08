const mongoose=require('mongoose')
const {Schema}=mongoose;

const productSchema =new Schema({
    productName:{type:String,require:true},
    price:{type:Number,require:true},
    description:{type:String,require:true},
    image:{type:String,require:true},
    quantity:{type:Number,require:true},
    customer:{type:Schema.ObjectId,ref:'users',require:true}
},{
    timestamps:true
})
module.exports = mongoose.model('products',productSchema)  