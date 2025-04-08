const mongoose=require('mongoose')
const {Schema}=mongoose;

const userSchema = new Schema({
    name:{type:String},
    password:{type:String},
    email:{type:String},
    isApprove:{type:Boolean,default:false},
    isAdmin:{type:Boolean,default:false},
},{
    timestamps:true
})

module.exports = mongoose.model('users',userSchema)   