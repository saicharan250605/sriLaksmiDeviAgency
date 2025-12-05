let mongoose = require("mongoose");
const sellSchema = new mongoose.Schema({
    date:{
        type:Date
    },
    name:{
        type:String,
        uppercase:true,
    },
    invoice:{
        type:String,
    },
    productSold:[{
        itemName:{
            type:String,
            uppercase:true,
        },
        number:{
            type:Number,
        },
        indCost:{
            type:Number,
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
    totalReceivable:{
        type:Number,
    },
    received:{
        type:Number,
    },
    parentProduct:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }
});

let sellClass = mongoose.model("Sell",sellSchema);
module.exports = sellClass;