const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
} ,{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports=mongoose.model("users",userSchema);  