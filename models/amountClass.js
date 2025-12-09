let mongoose = require("mongoose");
const amountSchema = new mongoose.Schema({
    date:{
        type:Date,
    },
    amountType:{
        type:String,
        uppercase:true,
    },
    money:{
        type:Number,
    },
    transactionId:{
        type:String,  
    }
});

let moneyClass = mongoose.model("money",amountSchema);
module.exports = moneyClass;