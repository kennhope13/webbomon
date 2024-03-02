const mongoose = require("mongoose");
const userSchema  = new mongoose . Schema({
    Email:String,
    Password: String,
    Avatar:String,
    Name:String,
    address:String,
    mobile:Number,
    Active:Boolean,
    RegisterDate:Date,
    userType:Number // 0 user , 1 admin
})
module.exports = mongoose.model("users",userSchema);