const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({});
UserSchema.plugin(passportLocalMongoose);
let User_SriLakshmiAgencies = mongoose.model("User_SriLakshmiAgencies",UserSchema);
module.exports = User_SriLakshmiAgencies;