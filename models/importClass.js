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
            ref:"subProductTypeClass",
        },
        parentItem:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ItemClass",
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
    paid:{
        type:Number,
    },
    balance:{
        type:Number,
    },
    parentProduct:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productTypeClass",
    }
});

let importClass = mongoose.model("ImportSchema",importSchema);
module.exports = importClass;