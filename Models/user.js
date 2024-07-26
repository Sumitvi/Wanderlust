let mongoose = require("mongoose");
let passportLocalMogoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
// ==========>>>>>>> Passport-Local-Mongoose automatically define username and password we dont'nt need to define that
    email:{
        type:String,
        required:true,
    }
})


userSchema.plugin(passportLocalMogoose);

let User = mongoose.model("User",userSchema);
module.exports = User;