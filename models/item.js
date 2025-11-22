let mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        uppercase:true,
    },
    total:{
        type:Number
    },
    sold:{
        type:Number
    },
    available:{
        type:Number
    },
});

let ItemClass = mongoose.model("Item",itemSchema);
module.exports = ItemClass;