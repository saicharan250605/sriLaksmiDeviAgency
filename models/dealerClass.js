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
    city:{
        type:String,
        uppercase:true,
    },
    gstNumber:{
        type:String,
    },
    invoices:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Export",
    }],
    amount:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"money",
    }]
});

let dealerClass = mongoose.model("Dealer",dealerSchema);
module.exports = dealerClass;