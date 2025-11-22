let mongoose = require("mongoose");
const exportSchema = new mongoose.Schema({
    date:{
        type:Date
    },
    dealer:{
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
    totalReceivable:{
        type:Number,
    },
    received:{
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

let exportClass = mongoose.model("Export",exportSchema);
module.exports = exportClass;