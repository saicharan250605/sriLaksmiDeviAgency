let mongoose = require("mongoose");
const importPlace_Schema = new mongoose.Schema({
    city:{
        type:String,
        uppercase:true,
    },
    companyName:{
        type:String,
        uppercase:true,
    },
    gstNumber:{
        type:String,
    },
    invoices:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ImportSchema",
    }],
    amount:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"money",
    }]
});

let importPlaceClass = mongoose.model("ImportPlace",importPlace_Schema);
module.exports = importPlaceClass;