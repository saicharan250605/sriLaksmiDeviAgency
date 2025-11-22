let mongoose = require("mongoose");
const dealerSchema = new mongoose.Schema({
    name:{
        type:String,
        uppercase:true,
    },
    shopName:{
        type:String,
        uppercase:true,
    },
    // mobile:{
    //     type:Number,
    // },
    city:{
        type:String,
        uppercase:true,
    },
    gstNumber:{
        type:String,
    },
    invoices:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"exportClass",
    }]
});

let dealerClass = mongoose.model("Dealer",dealerSchema);
module.exports = dealerClass;