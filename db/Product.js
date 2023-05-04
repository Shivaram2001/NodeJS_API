const mongoose=require("mongoose");

const productSchema=new mongoose.Schema({
    name:String,
    brand:String,
    price:String,
    category:String,
    userId:String
} ,{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports=mongoose.model("products",productSchema);  