let mongoose = require("mongoose");
const productTypeSchema = new mongoose.Schema({
    name:{
        type:String,
        uppercase:true,
    },
    image:{
        url:String,
        filename:String,
    },
    hsn:{
        type:Number,
    },
    subProducts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubProduct",
    }],
    import:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ImportSchema",
    }],
    export:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Export",
    }], 
    sell:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sell",
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

let productTypeClass = mongoose.model("Product",productTypeSchema);
module.exports = productTypeClass;