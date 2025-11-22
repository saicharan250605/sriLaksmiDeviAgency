let mongoose = require("mongoose");
const subProductTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        uppercase:true,
    },
    items:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ItemClass",
    }],
    total:{
        type:Number
    },
    sold:{
        type:Number
    },
    available:{
        type:Number
    }
});

let subProductTypeClass = mongoose.model("SubProduct",subProductTypeSchema);
module.exports = subProductTypeClass;