let mongoose = require("mongoose");
const importSchema = new mongoose.Schema({
    date:{
        type:Date
    },
    place:{
        type:String,
        uppercase:true,
    },
    invoice:{
        type:String,
    },
    productsBought:[{
        itemName:{
            type:String,
            uppercase:true,
        },
        number:{
            type:Number,
        },
        mrp:{
            type:Number,
        },
        amount:{
            type:Number
        },
        parentSubProduct:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubProduct",
        },
        parentItem:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Item",
        },
    }],
    cgst:{
        type:Number,
    },
    sgst:{
        type:Number,
    },
    totalSpendable:{
        type:Number,
    },
    parentProduct:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }
});

let importClass = mongoose.model("ImportSchema",importSchema);
module.exports = importClass;